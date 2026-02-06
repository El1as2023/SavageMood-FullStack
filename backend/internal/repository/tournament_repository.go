package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/models"
)

func CreateTournament(pool *pgxpool.Pool, t *models.Tournament) (*models.Tournament, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
		INSERT INTO tournaments (
			title, description, status, start_date, end_date, 
			max_teams, prize_pool, banner_url, creator_id
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at
	`
	err := pool.QueryRow(ctx, query,
		t.Title,
		t.Description,
		t.Status,
		t.StartDate,
		t.EndDate,
		t.MaxTeams,
		t.PrizePool,
		t.BannerUrl,
		t.CreatorId,
	).Scan(&t.ID, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func GetAllTournaments(pool *pgxpool.Pool) ([]models.Tournament, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
SELECT id, title, description, status, start_date, end_date, 
		       max_teams, prize_pool, banner_url, creator_id, created_at
		FROM tournaments
		ORDER BY created_at DESC
`
	var rows, err = pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	tournaments := []models.Tournament{}
	for rows.Next() {
		var t models.Tournament
		err = rows.Scan(
			&t.ID,
			&t.Title,
			&t.Description,
			&t.Status,
			&t.StartDate,
			&t.EndDate,
			&t.MaxTeams,
			&t.PrizePool,
			&t.BannerUrl,
			&t.CreatorId,
			&t.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		tournaments = append(tournaments, t)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return tournaments, nil
}
