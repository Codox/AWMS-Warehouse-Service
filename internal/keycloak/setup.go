package keycloak

import (
	"context"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"log"
)

type Config struct {
	AdminUsername string
	AdminPassword string
	ServerURL     string
	RealmName     string
	ClientID      string
}

func SetupKeycloak(config Config) {
	ctx := context.Background()

	client := gocloak.NewClient(config.ServerURL)

	token, err := client.LoginAdmin(ctx, config.AdminUsername, config.AdminPassword, "master")

	if err != nil {
		log.Fatalf("Keycloak authentication failed: %v", err)
	}

	// Check if the configured Realm exists
	existingRealms, err := client.GetRealms(ctx, token.AccessToken)
	if err != nil {
		log.Fatalf("Error fetching realms: %v", err)
	}

	realmExists := false

	for _, r := range existingRealms {
		if r.Realm != nil && *r.Realm == config.RealmName {
			realmExists = true
			break
		}
	}

	// If the Realm doesn't exist, create it
	if !realmExists {
		realm := gocloak.RealmRepresentation{
			Realm:   &config.RealmName,
			Enabled: gocloak.BoolP(true),
		}

		_, err = client.CreateRealm(ctx, token.AccessToken, realm)

		fmt.Println("Realm created successfully.")

	}

}
