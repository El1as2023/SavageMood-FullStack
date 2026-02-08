package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/models"
	"github.com/savagemood/backend/internal/repository"
)

type CreateTeamRequest struct {
	Name    string  `json:"name" binding:"required,min=3,max=50"`
	LogoURL *string `json:"logoUrl"`
}

func CreateTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		captainID := userID.(string)
		var req CreateTeamRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		team := &models.Team{
			Name:      req.Name,
			LogoUrl:   req.LogoURL,
			CaptainId: captainID,
		}
		err := repository.CreateTeam(pool, team)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team, name might be already taken"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"team": team})
	}
}
