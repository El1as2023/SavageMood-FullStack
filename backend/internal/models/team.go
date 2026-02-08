package models

import "time"

type Team struct {
	ID        int          `json:"id" db:"id"`
	Name      string       `json:"name" db:"name"`
	CaptainId string       `json:"captainId" db:"captain_id"`
	LogoUrl   *string      `json:"logoUrl" db:"logo_url"`
	CreatedAt time.Time    `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time    `json:"updatedAt" db:"updated_at"`
	Members   []TeamMember `json:"members,omitempty" db:"-"`
}
