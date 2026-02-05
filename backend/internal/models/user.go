package models

import "time"

type User struct {
	ID                    string     `json:"id" db:"id"`
	Username              string     `json:"username" db:"username"`
	Email                 string     `json:"email" db:"email"`
	PasswordHash          string     `json:"-" db:"password_hash"`
	Role                  string     `json:"role" db:"role"`
	IsVerified            bool       `json:"is_verified" db:"is_verified"`
	VerificationToken     *string    `json:"-" db:"verification_token"`
	VerificationExpiresAt *time.Time `json:"-"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}
