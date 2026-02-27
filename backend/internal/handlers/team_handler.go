package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/models"
	"github.com/savagemood/backend/internal/repository"
)

type CreateTeamRequest struct {
	Name    string  `json:"name" binding:"required,min=3,max=50"`
	LogoURL *string `json:"logoUrl"`
}

type JoinTeamRequest struct {
	TeamID int `json:"teamId" binding:"required"`
}
type LeaveTeamRequest struct {
	TeamID int `json:"teamId" binding:"required"`
}

func CreateTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		captainID := userID.(string)

		isInTeam, err := repository.IsUserInAnyTeam(pool, captainID)
		if err != nil {
			// Логуємо помилку для себе, а клієнту кажемо "спробуй пізніше"
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check team status"})
			return
		}
		if isInTeam {
			// 409 Conflict — ідеальний код для цього випадку
			c.JSON(http.StatusConflict, gin.H{"error": "You are already in a team. You cannot create a new one."})
			return
		}

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
		err = repository.CreateTeam(pool, team)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team, name might be already taken"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"team": team})
	}
}

func GetTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
			return
		}
		team, err := repository.GetTeamByID(pool, id)
		if err != nil {
			if err == pgx.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
				return
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		c.JSON(http.StatusOK, team)
	}
}

func JoinTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var req JoinTeamRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team join request body"})
			return
		}
		err := repository.JoinTeam(pool, req.TeamID, userID.(string))

		if err != nil {
			if err.Error() == "user id is already in the team" {
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			} else if err.Error() == "Max 5 players " {
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		c.JSON(http.StatusOK, gin.H{"team": "Joined team!"})
	}
}

func LeaveTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		var req LeaveTeamRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team leave request body"})
			return
		}
		err := repository.LeaveTeam(pool, req.TeamID, userID.(string))
		if err != nil {
			if err.Error() == "user not in the team" {
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			} else if err.Error() == "captain cannot leave team (delete team or transfer ownership)" {
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		c.JSON(http.StatusOK, gin.H{"team": "Left team!"})
	}
}

func DeleteTeamHandler(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		idStr := c.Param("id")
		teamId, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
			return
		}
		err = repository.DeleteTeam(pool, teamId, userId.(string))
		if err != nil {
			if err.Error() == "team not found or you are not captain" {
				c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		c.JSON(http.StatusOK, gin.H{"team": "Deleted team!"})
	}

}
