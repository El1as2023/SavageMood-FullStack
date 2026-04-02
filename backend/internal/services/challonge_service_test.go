package services_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/savagemood/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupMockChallongeServer(t *testing.T) (*http.ServeMux, *httptest.Server) {
	t.Helper()
	mux := http.NewServeMux()
	server := httptest.NewServer(mux)
	t.Cleanup(server.Close)
	return mux, server
}

func newTestChallongeService(serverURL string) *services.ChallongeService {
	svc := services.NewChallongeService("test-api-key", "testuser")
	svc.Client.Transport = &redirectTransport{
		originalBase: services.ChallongeBaseURL,
		targetBase:   serverURL,
	}
	return svc
}

type redirectTransport struct {
	originalBase string
	targetBase   string
}

func (t *redirectTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	req.URL.Scheme = "http"
	req.URL.Host = t.targetBase[len("http://"):]
	return http.DefaultTransport.RoundTrip(req)
}

func TestCreateTournament_Success(t *testing.T) {
	mux, server := setupMockChallongeServer(t)

	mux.HandleFunc("/v1/tournaments.json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, http.MethodPost, r.Method)

		username, password, ok := r.BasicAuth()
		assert.True(t, ok)
		assert.Equal(t, "testuser", username)
		assert.Equal(t, "test-api-key", password)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"tournament": map[string]interface{}{
				"id":  42,
				"url": "savagemood_test",
			},
		})
	})

	svc := newTestChallongeService(server.URL)

	result, err := svc.CreateTournament("Test Tournament", "savagemood_test")

	require.NoError(t, err)
	assert.Equal(t, 42, result.Tournament.ID)
	assert.Equal(t, "savagemood_test", result.Tournament.URL)
}

func TestCreateTournament_APIError(t *testing.T) {
	mux, server := setupMockChallongeServer(t)

	mux.HandleFunc("/v1/tournaments.json", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnprocessableEntity)
		w.Write([]byte(`{"errors": ["URL has already been taken"]}`))
	})

	svc := newTestChallongeService(server.URL)
	result, err := svc.CreateTournament("Test", "taken_url")

	assert.Nil(t, result)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "challonge API create error")
}

func TestAddParticipant_Success(t *testing.T) {
	mux, server := setupMockChallongeServer(t)

	mux.HandleFunc("/v1/tournaments/test_url/participants.json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, http.MethodPost, r.Method)

		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)
		_, hasAPIKey := body["api_key"]
		assert.False(t, hasAPIKey)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"participant": map[string]interface{}{"id": 1, "name": "Team Alpha"},
		})
	})

	svc := newTestChallongeService(server.URL)
	err := svc.AddParticipant("test_url", "Team Alpha")

	require.NoError(t, err)
}

func TestStartTournament_Success(t *testing.T) {
	mux, server := setupMockChallongeServer(t)

	mux.HandleFunc("/v1/tournaments/test_url/start.json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, http.MethodPost, r.Method)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"tournament": map[string]interface{}{"state": "underway"},
		})
	})

	svc := newTestChallongeService(server.URL)
	err := svc.StartTournament("test_url")

	require.NoError(t, err)
}

func TestGetBracket_Success(t *testing.T) {
	mux, server := setupMockChallongeServer(t)

	mux.HandleFunc("/v1/tournaments/test_url/matches.json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, http.MethodGet, r.Method)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode([]map[string]interface{}{
			{"match": map[string]interface{}{
				"id": 1, "state": "open", "round": 1,
			}},
		})
	})

	mux.HandleFunc("/v1/tournaments/test_url/participants.json", func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, http.MethodGet, r.Method)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode([]map[string]interface{}{
			{"participant": map[string]interface{}{
				"id": 1, "name": "Team Alpha", "seed": 1,
			}},
			{"participant": map[string]interface{}{
				"id": 2, "name": "Team Beta", "seed": 2,
			}},
		})
	})

	svc := newTestChallongeService(server.URL)
	bracket, err := svc.GetBracket("test_url")

	require.NoError(t, err)
	assert.Len(t, bracket.Matches, 1)
	assert.Len(t, bracket.Participants, 2)
	assert.Equal(t, "open", bracket.Matches[0].Match.State)
	assert.Equal(t, "Team Alpha", bracket.Participants[0].Participant.Name)
}
