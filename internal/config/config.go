package config

import "os"

type Config struct {
	PostgresURI string
	Port        string
}

func Load() *Config {
	return &Config{
		PostgresURI: GetEnv("POSTGRES_URI", "postgres://awms:awms@postgres:5432/awms?sslmode=disable"),
		Port:        GetEnv("PORT", "8000"),
	}
}

func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
