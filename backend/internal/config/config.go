package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL       string
	Port              string
	JWTSecret         string
	ChallongeAPIKey   string
	ChallongeUsername string
}

func Load() (*Config, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file")
	}
	var config *Config = &Config{
		DatabaseURL:       os.Getenv("DATABASE_URL"),
		Port:              os.Getenv("PORT"),
		JWTSecret:         os.Getenv("JWT_SECRET"),
		ChallongeAPIKey:   os.Getenv("CHALLONGE_API_KEY"),
		ChallongeUsername: os.Getenv("CHALLONGE_USERNAME"),
	}
	return config, nil
}
