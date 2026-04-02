package main

import (
	"log"
	"log/slog"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/config"
	"github.com/savagemood/backend/internal/database"
	"github.com/savagemood/backend/internal/handlers"
	"github.com/savagemood/backend/internal/middleware"
	"github.com/savagemood/backend/internal/services"
)

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})))

	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Config load error: ", err)
	}
	slog.Info("Config loaded")

	var pool *pgxpool.Pool
	pool, err = database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Database connection error: ", err)
	}
	defer pool.Close()
	slog.Info("PostgreSQL connected")

	challongeService := services.NewChallongeService(cfg.ChallongeAPIKey, cfg.ChallongeUsername)

	cacheService, err := services.NewRedisCacheService(cfg.RedisURL)
	if err != nil {
		log.Fatal("Redis connection error: ", err)
	}
	slog.Info("Redis connected")

	var router *gin.Engine = gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.POST("/auth/register", handlers.Register(pool, cfg))
		api.POST("/auth/login", handlers.Login(pool, cfg))
		api.GET("/verify-email", handlers.VerifyEmail(pool))
	}

	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware(cfg))
	{
		protected.GET("/profile", handlers.GetMe(pool))
		protected.GET("/tournaments", handlers.GetAllTournamentsHandler(pool))
		protected.GET("/tournaments/:id", handlers.GetTournamentHandler(pool))
		protected.GET("/tournaments/:id/bracket", handlers.GetTournamentBracketHandler(pool, challongeService, cacheService))
		protected.POST("/team", handlers.CreateTeamHandler(pool))
		protected.GET("/team/:id", handlers.GetTeamHandler(pool))
		protected.POST("/team/join", handlers.JoinTeamHandler(pool))
		protected.POST("/team/leave", handlers.LeaveTeamHandler(pool))
		protected.DELETE("/team/delete/:id", handlers.DeleteTeamHandler(pool))
		protected.POST("/tournaments/:id/register", handlers.RegisterTeamHandler(pool, challongeService))

		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		admin.POST("/create-tournament", handlers.CreateTournamentHandler(pool, challongeService))
		admin.PATCH("/tournaments/:id", handlers.UpdateTournamentHandler(pool))
		admin.PATCH("/tournaments/:id/status", handlers.UpdateTournamentStatusHandler(pool))
		admin.DELETE("/tournaments/:id", handlers.DeleteTournamentHandler(pool))
		admin.POST("/tournaments/:id/start", handlers.StartTournamentHandler(pool, challongeService, cacheService))
	}

	slog.Info("Server starting", "port", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Server error: ", err)
	}
}
