package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UUID     string             `json:"uuid" bson:"uuid"`
	ForeName string             `json:"first_name" bson:"first_name"`
	LastName string             `json:"last_name" bson:"last_name"`
	Email    string             `json:"email" bson:"email"`
}
