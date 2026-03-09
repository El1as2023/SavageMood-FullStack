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
	SMTPHost          string
	SMTPPort          string
	SMTPUser          string
	SMTPPassword      string
	FrontendURL       string
}

func Load() (*Config, error) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Error loading .env file")
	}
	var config *Config = &Config{
		DatabaseURL:       os.Getenv("DATABASE_URL"),
		Port:              os.Getenv("PORT"),
		JWTSecret:         os.Getenv("JWT_SECRET"),
		ChallongeAPIKey:   os.Getenv("CHALLONGE_API_KEY"),
		ChallongeUsername: os.Getenv("CHALLONGE_USERNAME"),
		SMTPHost:          os.Getenv("SMTP_HOST"),
		SMTPPort:          os.Getenv("SMTP_PORT"),
		SMTPUser:          os.Getenv("SMTP_USER"),
		SMTPPassword:      os.Getenv("SMTP_PASS"),
		FrontendURL:       os.Getenv("FRONTEND_URL"),
	}
	return config, nil
}
