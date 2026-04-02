package services_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
	"github.com/savagemood/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestCache(t *testing.T) (*services.RedisCacheService, *miniredis.Miniredis) {
	t.Helper()

	mr, err := miniredis.Run()
	require.NoError(t, err)

	cache, err := services.NewRedisCacheService("redis://" + mr.Addr())
	require.NoError(t, err)

	t.Cleanup(func() { mr.Close() })

	return cache, mr
}

func TestCacheSet_AndGet(t *testing.T) {
	cache, _ := setupTestCache(t)
	ctx := context.Background()

	key := "test:bracket:123"
	value := map[string]string{"name": "Test Tournament"}

	err := cache.Set(ctx, key, value, 10*time.Second)
	require.NoError(t, err)

	result, err := cache.Get(ctx, key)
	require.NoError(t, err)

	var got map[string]string
	err = json.Unmarshal([]byte(result), &got)
	require.NoError(t, err)
	assert.Equal(t, "Test Tournament", got["name"])
}

func TestCacheGet_Miss(t *testing.T) {
	cache, _ := setupTestCache(t)
	ctx := context.Background()

	_, err := cache.Get(ctx, "non:existent:key")

	assert.Equal(t, redis.Nil, err)
}

func TestCacheDelete(t *testing.T) {
	cache, _ := setupTestCache(t)
	ctx := context.Background()

	key := "test:delete:key"

	err := cache.Set(ctx, key, "value", 10*time.Second)
	require.NoError(t, err)

	err = cache.Delete(ctx, key)
	require.NoError(t, err)

	_, err = cache.Get(ctx, key)
	assert.Equal(t, redis.Nil, err)
}

func TestCacheTTL(t *testing.T) {
	cache, mr := setupTestCache(t)
	ctx := context.Background()

	key := "test:ttl:key"
	ttl := 1 * time.Second

	err := cache.Set(ctx, key, "temporary", ttl)
	require.NoError(t, err)

	_, err = cache.Get(ctx, key)
	require.NoError(t, err)

	mr.FastForward(2 * time.Second)

	_, err = cache.Get(ctx, key)
	assert.Equal(t, redis.Nil, err)
}

func TestNewRedisCacheService_InvalidURL(t *testing.T) {
	_, err := services.NewRedisCacheService("not-a-valid-url")
	assert.Error(t, err)
}
