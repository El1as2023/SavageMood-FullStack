package models

import "time"

type TeamMember struct {
	ID       int       `json:"id" db:"id"`
	TeamID   int       `json:"teamId" db:"team_id"`
	UserID   string    `json:"userId" db:"user_id"`
	Role     string    `json:"role" db:"role"`
	JoinedAt time.Time `json:"joinedAt" db:"joined_at"`
	User     *User     `json:"user,omitempty" db:"-"`
}
