package services

import (
	"awms-be/internal/models"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserService struct {
	collection *mongo.Collection
}

func NewUserService(client *mongo.Client) *UserService {
	return &UserService{
		collection: client.Database("awms-be").Collection("users"),
	}
}

func (us *UserService) GetAllUsers() ([]models.User, error) {
	var users []models.User // Ensure users is always initialized
	cursor, err := us.collection.Find(context.TODO(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
