package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	"github.com/redis/go-redis/v9"
)

type CacheServiceInterface interface {
	Get(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
}

type RedisCacheService struct {
	client *redis.Client
}

func NewRedisCacheService(redisURL string) (*RedisCacheService, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("invalid Redis URL: %w", err)
	}

	client := redis.NewClient(opts)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("could not connect to Redis: %w", err)
	}

	slog.Info("Redis connection established")
	return &RedisCacheService{client: client}, nil
}

func (r *RedisCacheService) Get(ctx context.Context, key string) (string, error) {
	val, err := r.client.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return "", redis.Nil
		}
		slog.Error("Redis get error", "key", key, "error", err)
		return "", fmt.Errorf("cache read error: %w", err)
	}
	return val, nil
}

func (r *RedisCacheService) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("cache serialize error: %w", err)
	}

	if err := r.client.Set(ctx, key, data, ttl).Err(); err != nil {
		slog.Error("Redis set error", "key", key, "error", err)
		return fmt.Errorf("cache write error: %w", err)
	}

	slog.Debug("Saved to Redis", "key", key, "ttl", ttl)
	return nil
}

func (r *RedisCacheService) Delete(ctx context.Context, key string) error {
	if err := r.client.Del(ctx, key).Err(); err != nil {
		slog.Error("Redis delete error", "key", key, "error", err)
		return fmt.Errorf("cache delete error: %w", err)
	}

	slog.Debug("Deleted from Redis", "key", key)
	return nil
}
