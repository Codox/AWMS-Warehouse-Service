package config

import "os"

type Config struct {
	PostgresURI           string
	Port                  string
	KeycloakAdminUsername string
	KeycloakAdminPassword string
	KeycloakServerURL     string
	KeycloakRealmName     string
	KeycloakClientID      string
}

func Load() *Config {
	return &Config{
		PostgresURI: GetEnv("POSTGRES_URI", "postgres://awms:awms@postgres:5432/awms?sslmode=disable"),
		Port:        GetEnv("PORT", "8000"),

		KeycloakAdminUsername: GetEnv("KEYCLOAK_ADMIN_USERNAME", "admin"),
		KeycloakAdminPassword: GetEnv("KEYCLOAK_ADMIN_PASSWORD", "admin"),
		KeycloakServerURL:     GetEnv("KEYCLOAK_SERVER_URL", "http://localhost:8080/auth"),
		KeycloakRealmName:     GetEnv("KEYCLOAK_REALM_NAME", "awms"),
		KeycloakClientID:      GetEnv("KEYCLOAK_CLIENT_ID", "awms"),
	}
}

func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
