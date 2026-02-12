package models

import "time"

type Tournament struct {
	ID          int        `json:"id" db:"id"`
	Title       string     `json:"title" db:"title"`
	Description string     `json:"description" db:"description"`
	Status      string     `json:"status" db:"status"`
	StartDate   time.Time  `json:"start_date" db:"start_date"`
	EndDate     *time.Time `json:"end_date" db:"end_date"`
	MaxTeams    int        `json:"max_teams" db:"max_teams"`
	PrizePool   string     `json:"prize_pool" db:"prize_pool"`
	BannerUrl   string     `json:"banner_url" db:"banner_url"`
	CreatorId   string     `json:"creator_id" db:"creator_id"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`

	ChallongeID  int    `json:"challongeId" db:"challonge_id"`
	ChallongeURL string `json:"challongeUrl" db:"challonge_url"`

	Teams []Team `json:"teams,omitempty"`
}
