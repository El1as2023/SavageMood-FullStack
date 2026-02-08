package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/models"
)

func CreateTeam(pool *pgxpool.Pool, team *models.Team) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	queryTeam := `
INSERT INTO teams (name,captain_id,logo_url)
VALUES ($1,$2,$3)
RETURNING id,created_at,updated_at
`
	err = tx.QueryRow(ctx, queryTeam, team.Name, team.CaptainId, team.LogoUrl).Scan(
		&team.ID,
		&team.CreatedAt,
		&team.UpdatedAt,
	)
	if err != nil {
		return err
	}
	queryMember := `
INSERT INTO teams_members (team_id,user_id,role)
VALUES ($1,$2,'captain')
`
	_, err = tx.Exec(ctx, queryMember, team.ID, team.CaptainId)
	if err != nil {
		return err
	}
	return tx.Commit(ctx)
}
