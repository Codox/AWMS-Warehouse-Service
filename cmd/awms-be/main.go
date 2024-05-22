package main

import (
	"awms-be/internal/config"
	"awms-be/internal/database"
	"awms-be/internal/routes"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	cfg := config.Load()

	// Connect to MongoDB
	client, err := database.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(nil)

	r := gin.Default()

	routes.SetupRoutes(r, client)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
