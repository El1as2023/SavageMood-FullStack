package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
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

func GetTournamentById(pool *pgxpool.Pool, id int) (*models.Tournament, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
SELECT id, title, description, status, start_date, end_date,
max_teams, prize_pool, banner_url, creator_id, created_at, updated_at
FROM tournaments
WHERE id = $1
`

	var tournament models.Tournament
	err := pool.QueryRow(ctx, query, id).Scan(
		&tournament.ID,
		&tournament.Title,
		&tournament.Description,
		&tournament.Status,
		&tournament.StartDate,
		&tournament.EndDate,
		&tournament.MaxTeams,
		&tournament.PrizePool,
		&tournament.BannerUrl,
		&tournament.CreatorId,
		&tournament.CreatedAt,
		&tournament.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &tournament, nil
}

func UpdateTournament(pool *pgxpool.Pool, id int, t *models.Tournament) error {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var query string = `
UPDATE tournaments
SET title=$1, description=$2, start_date=$3, max_teams=$4, prize_pool=$5, banner_url=$6, updated_at=NOW()
		WHERE id=$7
`
	commandTag, err := pool.Exec(ctx, query,
		t.Title,
		t.Description,
		t.StartDate,
		t.MaxTeams,
		t.PrizePool,
		t.BannerUrl,
		id)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func UpdateTournamentStatus(pool *pgxpool.Pool, id int, newStatus string) error {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `UPDATE tournaments
SET status=$1, updated_at=NOW() WHERE id=$2`
	commandTag, err := pool.Exec(ctx, query, newStatus, id)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
func DeleteTournament(pool *pgxpool.Pool, id int) error {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	query := `DELETE FROM tournaments WHERE id=$1`
	commandTag, err := pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
