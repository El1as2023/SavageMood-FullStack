package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func AdminOnly(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

	}
}
