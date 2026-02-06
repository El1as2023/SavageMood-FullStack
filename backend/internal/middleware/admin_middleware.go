package middleware

import "github.com/gin-gonic/gin"

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists || role != "admin" {
			c.JSON(403, gin.H{"error": "You do not have permission to access this resource"})
			c.Abort()
			return
		}
		c.Next()
	}
}
