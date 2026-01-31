package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(databaseURL string) (*pgxpool.Pool, error) {
	var ctx context.Context = context.Background()
	var config *pgxpool.Config
	var err error

	config, err = pgxpool.ParseConfig(databaseURL)
	if err != nil {
		log.Printf("Error parsing database URL : %v", err)
		return nil, err
	}
	var pool *pgxpool.Pool
	pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("Error connecting to database: %s", err)
		return nil, err
	}
	err = pool.Ping(ctx)
	if err != nil {
		log.Printf("Error pinging database: %s", err)
		pool.Close()
		return nil, err
	}
	log.Printf("Connected to database %s", databaseURL)
	return pool, nil
}
