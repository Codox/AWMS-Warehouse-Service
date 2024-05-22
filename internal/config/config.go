package config

import "os"

type Config struct {
	MongoURI string
	Port     string
}

func Load() *Config {
	return &Config{
		MongoURI: GetEnv("MONGO_URI", "mongodb://localhost:27017"),
		Port:     GetEnv("PORT", "8000"),
	}
}

func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
