package repository

import (
	"context"
	"fmt"
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
	queryTeams := `
	SELECT t.id, t.name, t.logo_url, t.captain_id
FROM teams t
	JOIN tournament_participants tp ON t.id = tp.team_id
	WHERE tp.tournament_id = $1
`
	rows, err := pool.Query(ctx, queryTeams, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	tournament.Teams = []models.Team{}
	for rows.Next() {
		var team models.Team
		err = rows.Scan(
			&team.ID,
			&team.Name,
			&team.LogoUrl,
			&team.CaptainId,
		)
		if err != nil {
			return nil, err
		}
		tournament.Teams = append(tournament.Teams, team)
	}
	if err = rows.Err(); err != nil {
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

func RegisterTeamForTournament(pool *pgxpool.Pool, tournamentId int, teamId int, captainId string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var realCaptainID string

	queryCheckCaptain := `
	SELECT captain_id FROM teams WHERE id=$1

`
	err = tx.QueryRow(ctx, queryCheckCaptain, teamId).Scan(&realCaptainID)
	if err != nil {
		return fmt.Errorf("team not found")
	}
	if realCaptainID != captainId {
		return fmt.Errorf("only captain can register to tournament")
	}

	var maxTeams, currentTeams int
	queryLimit := `
SELECT max_teams FROM tournaments WHERE id=$1`
	err = tx.QueryRow(ctx, queryLimit, tournamentId).Scan(&maxTeams)
	if err != nil {
		return fmt.Errorf("tournament not found")
	}

	queryCount := `
SELECT count(*) FROM tournament_participants WHERE tournament_id=$1`
	err = tx.QueryRow(ctx, queryCount, tournamentId).Scan(&currentTeams)
	if err != nil {
		return err
	}

	if currentTeams >= maxTeams {
		return fmt.Errorf("tournament is full")
	}

	queryRegister := `
INSERT INTO tournament_participants (tournament_id, team_id)
VALUES ($1, $2)
`
	_, err = tx.Exec(ctx, queryRegister, tournamentId, teamId)
	if err != nil {
		return fmt.Errorf("team is already registered for this tournament")
	}
	return tx.Commit(ctx)
}
