package config

import (
	"fmt"
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
	RedisURL          string
	SMTPHost          string
	SMTPPort          string
	SMTPUser          string
	SMTPPassword      string
	FrontendURL       string
}

func Load() (*Config, error) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := &Config{
		DatabaseURL:       os.Getenv("DATABASE_URL"),
		Port:              os.Getenv("PORT"),
		JWTSecret:         os.Getenv("JWT_SECRET"),
		ChallongeAPIKey:   os.Getenv("CHALLONGE_API_KEY"),
		ChallongeUsername: os.Getenv("CHALLONGE_USERNAME"),
		RedisURL:          os.Getenv("REDIS_URL"),
		SMTPHost:          os.Getenv("SMTP_HOST"),
		SMTPPort:          os.Getenv("SMTP_PORT"),
		SMTPUser:          os.Getenv("SMTP_USER"),
		SMTPPassword:      os.Getenv("SMTP_PASS"),
		FrontendURL:       os.Getenv("FRONTEND_URL"),
	}

	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

func (c *Config) Validate() error {
	var missing []string

	if c.DatabaseURL == "" {
		missing = append(missing, "DATABASE_URL")
	}
	if c.Port == "" {
		missing = append(missing, "PORT")
	}
	if c.JWTSecret == "" {
		missing = append(missing, "JWT_SECRET")
	}
	if c.ChallongeAPIKey == "" {
		missing = append(missing, "CHALLONGE_API_KEY")
	}
	if c.ChallongeUsername == "" {
		missing = append(missing, "CHALLONGE_USERNAME")
	}
	if c.RedisURL == "" {
		missing = append(missing, "REDIS_URL")
	}

	if len(missing) > 0 {
		return fmt.Errorf("missing required environment variables: %v", missing)
	}

	return nil
}
