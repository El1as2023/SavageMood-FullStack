package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/savagemood/backend/internal/services"
	"github.com/stretchr/testify/assert"
)

type MockChallongeService struct {
	CreateTournamentResult *services.CreateTournamentResponse
	Err                   error
	GetBracketData        *services.BracketResponse
	GetBracketErr         error
}

var _ services.ChallongeServiceInterface = (*MockChallongeService)(nil)

func (m *MockChallongeService) CreateTournament(name, url string) (*services.CreateTournamentResponse, error) {
	return m.CreateTournamentResult, m.Err
}
func (m *MockChallongeService) AddParticipant(tournamentID string, teamName string) error {
	return m.Err
}
func (m *MockChallongeService) StartTournament(tournamentID string) error { return m.Err }
func (m *MockChallongeService) GetBracket(tournamentURL string) (*services.BracketResponse, error) {
	return m.GetBracketData, m.GetBracketErr
}

type MockCacheService struct {
	store       map[string]string
	ForceGetErr error
	SetErr      error
	DeleteErr   error
}

var _ services.CacheServiceInterface = (*MockCacheService)(nil)

func NewMockCacheService() *MockCacheService {
	return &MockCacheService{
		store: make(map[string]string),
	}
}

func (m *MockCacheService) Get(_ context.Context, key string) (string, error) {
	if m.ForceGetErr != nil {
		return "", m.ForceGetErr
	}
	val, ok := m.store[key]
	if !ok {
		return "", redis.Nil
	}
	return val, nil
}

func (m *MockCacheService) Set(_ context.Context, key string, value interface{}, _ time.Duration) error {
	if m.SetErr != nil {
		return m.SetErr
	}
	data, _ := json.Marshal(value)
	m.store[key] = string(data)
	return nil
}

func (m *MockCacheService) Delete(_ context.Context, key string) error {
	delete(m.store, key)
	return m.DeleteErr
}

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	return gin.New()
}

func TestGetTournamentBracket_CacheFlow(t *testing.T) {
	mockCache := NewMockCacheService()
	mockChallonge := &MockChallongeService{
		GetBracketData: &services.BracketResponse{
			Matches: []services.MatchWrapper{
				{Match: struct {
					ID        int    `json:"id"`
					State     string `json:"state"`
					Player1ID *int   `json:"player1_id"`
					Player2ID *int   `json:"player2_id"`
					WinnerID  *int   `json:"winner_id"`
					Round     int    `json:"round"`
					ScoresCsv string `json:"scores_csv"`
				}{ID: 1, State: "open", Round: 1}},
			},
		},
	}

	bracket, err := mockChallonge.GetBracket("test_url")
	assert.NoError(t, err)
	assert.Len(t, bracket.Matches, 1)

	ctx := context.Background()

	_, getErr := mockCache.Get(ctx, "bracket:test_url")
	assert.Equal(t, redis.Nil, getErr)

	setErr := mockCache.Set(ctx, "bracket:test_url", bracket, 2*time.Minute)
	assert.NoError(t, setErr)

	cached, getErr := mockCache.Get(ctx, "bracket:test_url")
	assert.NoError(t, getErr)
	assert.NotEmpty(t, cached)
}

func TestCreateTournamentHandler_ChallongeError(t *testing.T) {
	mockChallonge := &MockChallongeService{
		Err: assert.AnError,
	}

	_, err := mockChallonge.CreateTournament("Test", "test_url")
	assert.Error(t, err)
}

func TestMockCacheService_SetAndGet(t *testing.T) {
	cache := NewMockCacheService()
	ctx := context.Background()

	_, err := cache.Get(ctx, "key")
	assert.Equal(t, redis.Nil, err)

	err = cache.Set(ctx, "key", map[string]string{"test": "value"}, time.Minute)
	assert.NoError(t, err)

	val, err := cache.Get(ctx, "key")
	assert.NoError(t, err)
	assert.Contains(t, val, "test")
}

func TestHealthEndpoint(t *testing.T) {
	router := setupRouter()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	req := httptest.NewRequest(http.MethodGet, "/health", bytes.NewBuffer(nil))
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "ok")
}
