package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/savagemood/backend/internal/config"
	"github.com/savagemood/backend/internal/middleware"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const testJWTSecret = "test-super-secret-jwt-key"

func createTestConfig() *config.Config {
	return &config.Config{
		DatabaseURL:       "postgres://test",
		Port:              "8080",
		JWTSecret:         testJWTSecret,
		ChallongeAPIKey:   "key",
		ChallongeUsername: "user",
		RedisURL:          "redis://localhost:6379",
	}
}

func generateToken(t *testing.T, userID, role string, expiresIn time.Duration) string {
	t.Helper()
	claims := jwt.MapClaims{
		"sub":  userID,
		"role": role,
		"exp":  time.Now().Add(expiresIn).Unix(),
		"iat":  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(testJWTSecret))
	require.NoError(t, err)
	return tokenStr
}

func setupMiddlewareTest(t *testing.T, authHeader string) (*httptest.ResponseRecorder, *gin.Context) {
	t.Helper()

	gin.SetMode(gin.TestMode)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	if authHeader != "" {
		req.Header.Set("Authorization", authHeader)
	}
	c.Request = req

	return w, c
}

func TestAuthMiddleware_ValidToken(t *testing.T) {
	cfg := createTestConfig()
	token := generateToken(t, "user-123", "player", 24*time.Hour)

	w, c := setupMiddlewareTest(t, "Bearer "+token)

	handler := middleware.AuthMiddleware(cfg)
	handler(c)

	assert.Equal(t, http.StatusOK, w.Code)

	userId, exists := c.Get("userId")
	assert.True(t, exists)
	assert.Equal(t, "user-123", userId)

	userRole, exists := c.Get("userRole")
	assert.True(t, exists)
	assert.Equal(t, "player", userRole)
}

func TestAuthMiddleware_MissingHeader(t *testing.T) {
	cfg := createTestConfig()
	w, c := setupMiddlewareTest(t, "")

	handler := middleware.AuthMiddleware(cfg)
	handler(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.True(t, c.IsAborted())
}

func TestAuthMiddleware_InvalidBearerFormat(t *testing.T) {
	cfg := createTestConfig()
	token := generateToken(t, "user-123", "player", 24*time.Hour)

	w, c := setupMiddlewareTest(t, token)

	handler := middleware.AuthMiddleware(cfg)
	handler(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.True(t, c.IsAborted())
}

func TestAuthMiddleware_ExpiredToken(t *testing.T) {
	cfg := createTestConfig()
	expiredToken := generateToken(t, "user-123", "player", -1*time.Minute)

	w, c := setupMiddlewareTest(t, "Bearer "+expiredToken)

	handler := middleware.AuthMiddleware(cfg)
	handler(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.True(t, c.IsAborted())
}

func TestAuthMiddleware_WrongSigningKey(t *testing.T) {
	cfg := createTestConfig()

	claims := jwt.MapClaims{
		"sub":  "hacker-123",
		"role": "admin",
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	fakeToken, err := token.SignedString([]byte("wrong-secret-key"))
	require.NoError(t, err)

	w, c := setupMiddlewareTest(t, "Bearer "+fakeToken)

	handler := middleware.AuthMiddleware(cfg)
	handler(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.True(t, c.IsAborted())
}

func TestAuthMiddleware_ErrorNotLeakedToClient(t *testing.T) {
	cfg := createTestConfig()
	w, c := setupMiddlewareTest(t, "Bearer totally-invalid-jwt-string")

	handler := middleware.AuthMiddleware(cfg)
	handler(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	body := w.Body.String()
	assert.Contains(t, body, "Invalid or expired token")
	assert.NotContains(t, body, "malformed")
	assert.NotContains(t, body, "segments")
}
