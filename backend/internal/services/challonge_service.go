package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const ChallongeBaseURL = "https://api.challonge.com/v1"

type ChallongeServiceInterface interface {
	CreateTournament(name, url string) (*CreateTournamentResponse, error)
	AddParticipant(tournamentID string, teamName string) error
	StartTournament(tournamentID string) error
	GetBracket(tournamentURL string) (*BracketResponse, error)
}

type ChallongeService struct {
	ApiKey   string
	Username string
	Client   *http.Client
}

func NewChallongeService(apiKey, username string) *ChallongeService {
	return &ChallongeService{
		ApiKey:   apiKey,
		Username: username,
		Client:   &http.Client{Timeout: 10 * time.Second},
	}
}

type CreateTournamentResponse struct {
	Tournament struct {
		ID  int    `json:"id"`
		URL string `json:"url"`
	} `json:"tournament"`
}

type BracketResponse struct {
	Matches      []MatchWrapper      `json:"matches"`
	Participants []ParticipantWrapper `json:"participants"`
}

type MatchWrapper struct {
	Match struct {
		ID        int    `json:"id"`
		State     string `json:"state"`
		Player1ID *int   `json:"player1_id"`
		Player2ID *int   `json:"player2_id"`
		WinnerID  *int   `json:"winner_id"`
		Round     int    `json:"round"`
		ScoresCsv string `json:"scores_csv"`
	} `json:"match"`
}

type ParticipantWrapper struct {
	Participant struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
		Seed int    `json:"seed"`
	} `json:"participant"`
}

func (s *ChallongeService) CreateTournament(name, url string) (*CreateTournamentResponse, error) {
	endpoint := fmt.Sprintf("%s/tournaments.json", ChallongeBaseURL)

	payload := map[string]interface{}{
		"tournament": map[string]string{
			"name":            name,
			"url":             url,
			"tournament_type": "single elimination",
		},
	}

	resp, err := s.doRequest(http.MethodPost, endpoint, payload)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("challonge API create error: status %d, body: %s", resp.StatusCode, body)
	}

	var result CreateTournamentResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("challonge decode error: %w", err)
	}
	return &result, nil
}

func (s *ChallongeService) AddParticipant(tournamentID string, teamName string) error {
	endpoint := fmt.Sprintf("%s/tournaments/%s/participants.json", ChallongeBaseURL, tournamentID)

	payload := map[string]interface{}{
		"participant": map[string]string{
			"name": teamName,
		},
	}

	resp, err := s.doRequest(http.MethodPost, endpoint, payload)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("challonge API add participant error: status %d, body: %s", resp.StatusCode, body)
	}
	return nil
}

func (s *ChallongeService) StartTournament(tournamentID string) error {
	endpoint := fmt.Sprintf("%s/tournaments/%s/start.json", ChallongeBaseURL, tournamentID)

	resp, err := s.doRequest(http.MethodPost, endpoint, map[string]interface{}{})
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("challonge API start tournament error: status %d, body: %s", resp.StatusCode, body)
	}
	return nil
}

func (s *ChallongeService) GetBracket(tournamentURL string) (*BracketResponse, error) {
	matchesURL := fmt.Sprintf("%s/tournaments/%s/matches.json", ChallongeBaseURL, tournamentURL)
	participantsURL := fmt.Sprintf("%s/tournaments/%s/participants.json", ChallongeBaseURL, tournamentURL)

	matchesResp, err := s.doRequest(http.MethodGet, matchesURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error fetching matches: %w", err)
	}
	defer matchesResp.Body.Close()

	if matchesResp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(matchesResp.Body)
		return nil, fmt.Errorf("challonge matches error: status %d, body: %s", matchesResp.StatusCode, body)
	}

	var matches []MatchWrapper
	if err := json.NewDecoder(matchesResp.Body).Decode(&matches); err != nil {
		return nil, fmt.Errorf("error decoding matches: %w", err)
	}

	participantsResp, err := s.doRequest(http.MethodGet, participantsURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error fetching participants: %w", err)
	}
	defer participantsResp.Body.Close()

	if participantsResp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(participantsResp.Body)
		return nil, fmt.Errorf("challonge participants error: status %d, body: %s", participantsResp.StatusCode, body)
	}

	var participants []ParticipantWrapper
	if err := json.NewDecoder(participantsResp.Body).Decode(&participants); err != nil {
		return nil, fmt.Errorf("error decoding participants: %w", err)
	}

	return &BracketResponse{
		Matches:      matches,
		Participants: participants,
	}, nil
}

func (s *ChallongeService) doRequest(method, url string, data map[string]interface{}) (*http.Response, error) {
	var bodyReader io.Reader

	if data != nil {
		jsonBytes, err := json.Marshal(data)
		if err != nil {
			return nil, fmt.Errorf("error marshaling request: %w", err)
		}
		bodyReader = strings.NewReader(string(jsonBytes))
	}

	req, err := http.NewRequest(method, url, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.SetBasicAuth(s.Username, s.ApiKey)

	return s.Client.Do(req)
}
