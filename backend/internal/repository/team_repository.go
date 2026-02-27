package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
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

func GetTeamByID(pool *pgxpool.Pool, teamID int) (*models.Team, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var team models.Team
	queryTeam := `
SELECT id,name,captain_id,logo_url,
created_at,updated_at
FROM teams
WHERE id = $1
`
	err := pool.QueryRow(ctx, queryTeam, teamID).Scan(
		&team.ID,
		&team.Name,
		&team.CaptainId,
		&team.LogoUrl,
		&team.CreatedAt,
		&team.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	queryMembers := `
	SELECT tm.id, tm.team_id,tm.user_id,tm.role,tm.joined_at,u.username
FROM teams_members tm
	JOIN users u ON tm.user_id = u.id
	WHERE tm.team_id = $1
	
`
	rows, err := pool.Query(ctx, queryMembers, team.ID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	team.Members = []models.TeamMember{}
	for rows.Next() {
		var m models.TeamMember
		m.User = &models.User{}
		err = rows.Scan(
			&m.ID,
			&m.TeamID,
			&m.UserID,
			&m.Role,
			&m.JoinedAt,
			&m.User.Username,
		)
		if err != nil {
			return nil, err
		}
		team.Members = append(team.Members, m)
	}
	return &team, nil
}

func JoinTeam(pool *pgxpool.Pool, teamId int, userId string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	var exists bool
	queryCheckUser := `
SELECT EXISTS (SELECT 1 FROM teams_members WHERE user_id = $1 )
`
	err = tx.QueryRow(ctx, queryCheckUser, userId).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("user id is already in the team")
	}
	var membersCount int
	queryCheckTeam := `
SELECT count(*) FROM teams_members WHERE team_id = $1
`
	err = tx.QueryRow(ctx, queryCheckTeam, teamId).Scan(&membersCount)
	if err != nil {
		return err
	}
	if membersCount >= 5 {
		return fmt.Errorf("Max 5 players ")
	}
	queryJoin := `
INSERT INTO teams_members (team_id, user_id, role)
VALUES ($1,$2,'player')
`
	_, err = tx.Exec(ctx, queryJoin, teamId, userId)
	if err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func LeaveTeam(pool *pgxpool.Pool, teamId int, userId string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var role string
	queryCheck := `
SELECT role FROM teams_members WHERE team_id = $1 AND user_id = $2
`
	err := pool.QueryRow(ctx, queryCheck, teamId, userId).Scan(&role)
	if err != nil {
		if err == pgx.ErrNoRows {
			return fmt.Errorf("user not in the team")
		}
		return err
	}
	if role == "captain" {
		return fmt.Errorf("captain cannot leave team (delete team or transfer ownership)")
	}

	queryDelete := `DELETE FROM teams_members WHERE team_id = $1 AND user_id = $2`
	_, err = pool.Exec(ctx, queryDelete, teamId, userId)
	return err
}

func DeleteTeam(pool *pgxpool.Pool, teamId int, captainId string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	queryDelete := `DELETE FROM teams WHERE id = $1 AND captain_id = $2`
	commandTag, err := pool.Exec(ctx, queryDelete, teamId, captainId)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return fmt.Errorf("team not found or you are not captain")
	}
	return nil
}
func IsUserInAnyTeam(pool *pgxpool.Pool, userId string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM teams_members WHERE user_id = $1)`

	err := pool.QueryRow(ctx, query, userId).Scan(&exists)
	return exists, err
}
