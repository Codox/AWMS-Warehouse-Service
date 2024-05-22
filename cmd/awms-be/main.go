package main

import (
	"awms-be/internal/config"
	"awms-be/internal/database"
	"github.com/go-chi/chi/v5"
	"log"
	"net/http"
)

func main() {
	cfg := config.Load()

	// Connect to MongoDB
	client, err := database.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(nil)

	r := chi.NewRouter()

	log.Printf("Server listening on port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatal(err)
	}
}
