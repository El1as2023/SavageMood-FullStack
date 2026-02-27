package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/config"
	"github.com/savagemood/backend/internal/models"
	"github.com/savagemood/backend/internal/repository"
	"github.com/savagemood/backend/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=30"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}
type UserResponse struct {
	ID       string       `json:"id"`
	Username string       `json:"username"`
	Email    string       `json:"email"`
	Role     string       `json:"role"`
	Team     *models.Team `json:"team,omitempty"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

func Register(pool *pgxpool.Pool, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var registerRequest RegisterRequest
		if err := c.ShouldBindJSON(&registerRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerRequest.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password" + err.Error()})
			return
		}

		vToken := uuid.New().String()
		vExpires := time.Now().Add(24 * time.Hour)

		user := &models.User{
			Username:              registerRequest.Username,
			Email:                 registerRequest.Email,
			PasswordHash:          string(hashedPassword),
			Role:                  "player",
			IsVerified:            false,
			VerificationToken:     &vToken,
			VerificationExpiresAt: &vExpires,
		}
		createdUser, err := repository.CreateUser(pool, user)
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				if pgErr.ConstraintName == "users_email_key" {
					c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
				} else {
					c.JSON(http.StatusConflict, gin.H{"error": "User already exists "})
				}
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		go func() {
			emailService := services.NewEmailService(cfg)

			err := emailService.SendVerificationEmail(createdUser.Email, vToken)
			if err != nil {
				fmt.Printf("Failed to send verification email to %s: %v\n", createdUser.Email, err)
			} else {
				fmt.Printf("Email  verification sent to : %v\n", createdUser.Email)
			}
		}()
		c.JSON(http.StatusCreated, gin.H{"message": "Registration successful! Please Check your email address to activate your account"})
	}
}

func VerifyEmail(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")
		if token == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No token provided"})
			return
		}
		err := repository.VerifyUser(pool, token)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Email verified successfully"})
	}
}

func Login(pool *pgxpool.Pool, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginRequest LoginRequest
		if err := c.ShouldBindJSON(&loginRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		user, err := repository.GetUserByEmail(pool, loginRequest.Email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginRequest.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		if !user.IsVerified {
			c.JSON(http.StatusForbidden, gin.H{"error": "Please verify your email"})
			return
		}

		claims := jwt.MapClaims{
			"sub":  user.ID,
			"role": user.Role,
			"exp":  time.Now().Add(24 * time.Hour).Unix(),
			"iat":  time.Now().Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}
		response := LoginResponse{
			Token: tokenString,
			User: UserResponse{
				ID:       user.ID,
				Username: user.Username,
				Email:    user.Email,
				Role:     user.Role,
			},
		}
		c.JSON(http.StatusOK, response)
	}
}

func GetMe(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, exists := c.Get("userId")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		user, err := repository.GetUserById(pool, userId.(string))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
			return
		}
		team, err := repository.GetTeamByUserID(pool, user.ID)
		if err != nil {
			fmt.Printf("Error fetching user team: %v\n", err)
		}

		user.Team = team
		response := UserResponse{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
			Role:     user.Role,
			Team:     team,
		}
		c.JSON(http.StatusOK, response)
	}

}
