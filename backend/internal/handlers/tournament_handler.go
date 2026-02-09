package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/models"
	"github.com/savagemood/backend/internal/repository"
)

type TournamentRequest struct {
	Title       string    `json:"title" binding:"required,min=5"`
	Description string    `json:"description" binding:"required"`
	StartDate   time.Time `json:"start" binding:"required"`
	MaxTeams    int       `json:"maxTeamSize" binding:"required"`
	PrizePool   string    `json:"prizePoolSize" binding:"required"`
	BannerURL   string    `json:"bannerUrl" binding:"required"`
}

type UpdateTournamentRequest struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	StartDate   *time.Time `json:"start"`
	MaxTeams    *int       `json:"maxTeamSize"`
	PrizePool   *string    `json:"prizePoolSize"`
	BannerURL   *string    `json:"bannerUrl" `
}
type ChangeStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=upcoming ongoing finished"`
}

type RegisterTeamRequest struct {
	TeamId int `json:"teamId" binding:"required"`
}

func CreateTournamentHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		userIdInterface, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "User Id not found"})
			return
		}
		userId, ok := userIdInterface.(string)
		if !ok {

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
			return
		}
		var req TournamentRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tournament := &models.Tournament{
			Title:       req.Title,
			Description: req.Description,
			Status:      "upcoming",
			StartDate:   req.StartDate,
			MaxTeams:    req.MaxTeams,
			PrizePool:   req.PrizePool,
			BannerUrl:   req.BannerURL,
			CreatorId:   userId,
		}
		createdTournament, err := repository.CreateTournament(pool, tournament)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, createdTournament)
	}
}

func GetAllTournamentsHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		tournaments, err := repository.GetAllTournaments(pool)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, tournaments)
	}
}
func GetTournamentHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid tournament ID"})
			return
		}
		tournament, err := repository.GetTournamentById(pool, id)
		if err != nil {
			if err == pgx.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		c.JSON(http.StatusOK, tournament)
	}
}

func UpdateTournamentHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tournament ID"})
			return
		}

		var req UpdateTournamentRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		existingTournament, err := repository.GetTournamentById(pool, id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
			return
		}

		if req.Title != nil {
			existingTournament.Title = *req.Title
		}
		if req.Description != nil {
			existingTournament.Description = *req.Description
		}
		if req.StartDate != nil {
			existingTournament.StartDate = *req.StartDate
		}
		if req.MaxTeams != nil {
			existingTournament.MaxTeams = *req.MaxTeams
		}
		if req.PrizePool != nil {
			existingTournament.PrizePool = *req.PrizePool
		}
		if req.BannerURL != nil {
			existingTournament.BannerUrl = *req.BannerURL
		}

		err = repository.UpdateTournament(pool, id, existingTournament)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tournament: " + err.Error()})
			return
		}

		c.JSON(http.StatusOK, existingTournament)
	}
}

func UpdateTournamentStatusHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid tournament ID"})
			return
		}
		var req ChangeStatusRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be upcoming ongoing finished"})
			return
		}
		err = repository.UpdateTournamentStatus(pool, id, req.Status)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tournament status: " + err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": req.Status})
	}
}
func DeleteTournamentHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid tournament ID"})
			return
		}
		err = repository.DeleteTournament(pool, id)
		if err != nil {
			if err == pgx.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tournament: "})
			}
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Tournament deleted successfully"})
	}

}

func RegisterTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "You need to be logged in"})
			return
		}
		tournamentIdStr := c.Param("id")
		tournamentId, err := strconv.Atoi(tournamentIdStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tournament ID"})
			return
		}
		var req RegisterTeamRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err = repository.RegisterTeamForTournament(pool, tournamentId, req.TeamId, userId.(string))
		if err != nil {
			errMsg := err.Error()
			switch errMsg {
			case "team not found":
				c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
			case "tournament not found":
				c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
			case "only captain can register to tournament":
				c.JSON(http.StatusForbidden, gin.H{"error": errMsg})
			case "tournament is full":
				c.JSON(http.StatusConflict, gin.H{"error": errMsg})
			case "team is already registered for this tournament":
				c.JSON(http.StatusConflict, gin.H{"error": errMsg})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register team for tournament" + errMsg})

			}
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Team registered successfully for tournament "})
	}
}

func StartTournamentHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		tournamentId, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tournament ID"})
			return
		}
		err = repository.StartTournament(pool, tournamentId)
		if err != nil {
			errMsg := err.Error()
			switch errMsg {
			case "tournament is already started or finished":
				c.JSON(http.StatusConflict, gin.H{"error": "Tournament is already started or finished"})
			case "not enough teams to start tournament":
				c.JSON(http.StatusBadRequest, gin.H{"error": "Not enough teams to start tournament"})
			case "number of teams must be even (e.g., 2,4,8,16)":
				c.JSON(http.StatusBadRequest, gin.H{"error": "Number of teams must be even (e.g., 2,4,8,16)"})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start tournament" + errMsg})
			}
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Tournament started successfully"})
	}
}
