package config_test

import (
	"os"
	"testing"

	"github.com/savagemood/backend/internal/config"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setEnvVars(t *testing.T) func() {
	t.Helper()
	vars := map[string]string{
		"DATABASE_URL":       "postgres://user:pass@localhost/db",
		"PORT":               "8080",
		"JWT_SECRET":         "super-secret-key",
		"CHALLONGE_API_KEY":  "test-api-key",
		"CHALLONGE_USERNAME": "testuser",
		"REDIS_URL":          "redis://localhost:6379",
	}
	for k, v := range vars {
		os.Setenv(k, v)
	}
	return func() {
		for k := range vars {
			os.Unsetenv(k)
		}
	}
}

func TestLoad_Success(t *testing.T) {
	defer setEnvVars(t)()

	cfg, err := config.Load()

	require.NoError(t, err)
	assert.Equal(t, "8080", cfg.Port)
	assert.Equal(t, "super-secret-key", cfg.JWTSecret)
	assert.Equal(t, "test-api-key", cfg.ChallongeAPIKey)
	assert.Equal(t, "redis://localhost:6379", cfg.RedisURL)
}

func TestLoad_MissingJWTSecret(t *testing.T) {
	defer setEnvVars(t)()

	os.Unsetenv("JWT_SECRET")

	cfg, err := config.Load()

	assert.Nil(t, cfg)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "JWT_SECRET")
}

func TestLoad_MissingRedisURL(t *testing.T) {
	defer setEnvVars(t)()
	os.Unsetenv("REDIS_URL")

	_, err := config.Load()

	require.Error(t, err)
	assert.Contains(t, err.Error(), "REDIS_URL")
}

func TestLoad_MultipleFieldsMissing(t *testing.T) {
	os.Unsetenv("DATABASE_URL")
	os.Unsetenv("PORT")
	os.Unsetenv("JWT_SECRET")
	os.Unsetenv("CHALLONGE_API_KEY")
	os.Unsetenv("CHALLONGE_USERNAME")
	os.Unsetenv("REDIS_URL")

	_, err := config.Load()

	require.Error(t, err)
	assert.Contains(t, err.Error(), "DATABASE_URL")
	assert.Contains(t, err.Error(), "JWT_SECRET")
	assert.Contains(t, err.Error(), "REDIS_URL")
}

func TestValidate_AllFieldsPresent(t *testing.T) {
	cfg := &config.Config{
		DatabaseURL:       "postgres://...",
		Port:              "8080",
		JWTSecret:         "secret",
		ChallongeAPIKey:   "key",
		ChallongeUsername: "user",
		RedisURL:          "redis://localhost:6379",
	}

	err := cfg.Validate()
	assert.NoError(t, err)
}
