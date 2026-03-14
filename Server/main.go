package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func connectDB() {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Tokyo",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "apu2026"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	log.Println("database connection established")
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func main() {
	connectDB()

	r := gin.Default()

	r.GET("/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "hello world",
		})
	})

	r.GET("/health", func(c *gin.Context) {
		sqlDB, err := DB.DB()
		if err != nil {
			c.JSON(500, gin.H{"status": "db error", "error": err.Error()})
			return
		}
		if err := sqlDB.Ping(); err != nil {
			c.JSON(500, gin.H{"status": "db unreachable", "error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
