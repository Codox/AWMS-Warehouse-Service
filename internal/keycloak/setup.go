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

	fmt.Println("Keycloak client created successfully.")
	fmt.Println("Admin username: ", config.AdminUsername)
	fmt.Println("Admin password: ", config.AdminPassword)
	fmt.Println("Server URL: ", config.ServerURL)
	fmt.Println("Realm name: ", config.RealmName)
	fmt.Println("Client ID: ", config.ClientID)

	_, err := client.LoginAdmin(ctx, config.AdminUsername, config.AdminPassword, "master")

	if err != nil {
		log.Fatalf("Keycloak authentication failed: %v", err)

	}

	// Get token
	token, err := client.LoginAdmin(ctx, config.AdminUsername, config.AdminPassword, "master")
	if err != nil {
		log.Fatalf("Keycloak authentication failed: %v", err)
	}

	fmt.Println("Keycloak authentication successful.")

	// Check for AWMS realm
	realmExists := CheckRealmExists(ctx, client, token, config.RealmName)

	// If the Realm doesn't exist, create it
	if !realmExists {
		realm := gocloak.RealmRepresentation{
			Realm:   &config.RealmName,
			Enabled: gocloak.BoolP(true),
		}

		_, err = client.CreateRealm(ctx, token.AccessToken, realm)

		fmt.Printf("Realm %s created successfully.", config.RealmName)
	}

	/*
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

		}*/

}

func CheckRealmExists(ctx context.Context, client *gocloak.GoCloak, token *gocloak.JWT, realmName string) bool {
	existingRealms, err := client.GetRealms(ctx, token.AccessToken)
	if err != nil {
		log.Fatalf("Error fetching realms: %v", err)
	}

	realmExists := false

	for _, r := range existingRealms {
		if r.Realm != nil && *r.Realm == realmName {
			realmExists = true
			break
		}
	}

	return realmExists
}
