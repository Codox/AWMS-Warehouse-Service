package main

import (
	"awms-be/internal/config"
	"awms-be/internal/routes"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"os"
)

func main() {
	cfg := config.Load()

	// Connect to Postgres
	pool, err := pgxpool.New(context.Background(), cfg.PostgresURI)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	r := gin.Default()

	routes.SetupRoutes(r, pool)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
