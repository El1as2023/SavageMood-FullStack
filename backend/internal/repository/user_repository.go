package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/models"
)

func CreateUser(pool *pgxpool.Pool, user *models.User) (*models.User, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
INSERT INTO users (
                   username,
                   email,
                   password_hash,
                   role,
                   is_verified,
                   verification_token,
                   verification_expires_at
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, created_at, updated_at`

	err := pool.QueryRow(ctx, query,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.IsVerified,
		user.VerificationToken,
		user.VerificationExpiresAt,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func GetUserByEmail(pool *pgxpool.Pool, email string) (*models.User, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
SELECT id, username, email, password_hash, role, is_verified, created_at, updated_at
FROM users
WHERE email = $1
`
	var user models.User

	err := pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func VerifyUser(pool *pgxpool.Pool, token string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
UPDATE users 
SET is_verified = true,
    verification_token = NULL,
    verification_expires_at = NULL
    WHERE verification_token = $1
    AND verification_expires_at > NOW()`

	cmdTag, err := pool.Exec(ctx, query, token)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("Invalid token or expired token")
	}
	return nil
}

func GetUserById(pool *pgxpool.Pool, userId string) (*models.User, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
SELECT id, username, email, password_hash, role, is_verified, created_at, updated_at
FROM users
WHERE id = $1`
	var user models.User
	err := pool.QueryRow(ctx, query, userId).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func GetTeamByUserID(pool *pgxpool.Pool, userID string) (*models.Team, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var team models.Team
	// Хитрий запит: ми шукаємо команду, де цей юзер є учасником
	query := `
        SELECT t.id, t.name, t.captain_id, t.logo_url, t.created_at, t.updated_at
        FROM teams t
        JOIN teams_members tm ON t.id = tm.team_id
        WHERE tm.user_id = $1
    `

	err := pool.QueryRow(ctx, query, userID).Scan(
		&team.ID, &team.Name, &team.CaptainId, &team.LogoUrl, &team.CreatedAt, &team.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil //
		}
		return nil, err
	}
	return &team, nil
}
