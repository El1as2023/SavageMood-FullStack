package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/savagemood/backend/internal/config"
	"github.com/savagemood/backend/internal/database"
	"github.com/savagemood/backend/internal/handlers"
	"github.com/savagemood/backend/internal/middleware"
)

func main() {
	var cfg *config.Config
	var err error
	cfg, err = config.Load()
	if err != nil {
		log.Fatal("Error loading config: ", err)
	}
	var pool *pgxpool.Pool
	pool, err = database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}
	defer pool.Close()

	var router *gin.Engine = gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Твій Next.js
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welocme to SavageMOOD",
		})
	})
	router.POST("/auth/register", handlers.Register(pool))
	router.POST("/auth/login", handlers.Login(pool, cfg))

	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware(cfg))
	{
		protected.GET("/profile", handlers.GetMe(pool))
		protected.GET("tournaments", handlers.GetAllTournamentsHandler(pool))
		protected.GET("/tournaments/:id", handlers.GetTournamentHandler(pool))

		//ADMIN
		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		admin.POST("/create-tournament", handlers.CreateTournamentHandler(pool))
		admin.PATCH("/tournaments/:id", handlers.UpdateTournamentHandler(pool))
		admin.PATCH("/tournaments/:id/status", handlers.UpdateTournamentStatusHandler(pool))
		admin.DELETE("/tournaments/:id", handlers.DeleteTournamentHandler(pool))
	}

	router.Run(":" + cfg.Port)
}
