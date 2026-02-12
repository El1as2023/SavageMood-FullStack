package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const ChallongeBaseURL = "https://api.challonge.com/v1"

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

func (s *ChallongeService) CreateTournament(name, url string) (*CreateTournamentResponse, error) {
	endpoint := fmt.Sprintf("%s/tournaments.json", ChallongeBaseURL)

	payload := map[string]interface{}{
		"api_key": s.ApiKey,
		"tournament": map[string]string{
			"name":            name,
			"url":             url,
			"tournament_type": "single elimination",
		},
	}

	resp, err := s.postRequest(endpoint, payload)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("challonge API create error: status %d", resp.StatusCode)
	}

	var result CreateTournamentResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *ChallongeService) AddParticipant(tournamentId string, teamName string) error {

	endpoint := fmt.Sprintf("%s/tournaments/%s/participants.json", ChallongeBaseURL, tournamentId)

	payload := map[string]interface{}{
		"api_key": s.ApiKey,
		"participant": map[string]string{
			"name": teamName,
		},
	}

	resp, err := s.postRequest(endpoint, payload)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("challonge API add participant error: status %d", resp.StatusCode)
	}
	return nil
}

func (s *ChallongeService) StartTournament(tournamentId string) error {
	endpoint := fmt.Sprintf("%s/tournaments/%s/start.json", ChallongeBaseURL, tournamentId)

	payload := map[string]interface{}{
		"api_key": s.ApiKey,
	}

	resp, err := s.postRequest(endpoint, payload)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("challonge API start tournament error: status %d", resp.StatusCode)
	}
	return nil
}

func (s *ChallongeService) postRequest(url string, data map[string]interface{}) (*http.Response, error) {
	jsonValue, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	return s.Client.Post(url, "application/json", bytes.NewBuffer(jsonValue))
}
