package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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
