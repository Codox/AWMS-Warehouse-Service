package services

import (
	"awms-be/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserService struct{}

func NewUserService(pool *pgxpool.Pool) *UserService {
	return &UserService{}
}

func (us *UserService) GetAllUsers() ([]models.User, error) {
	var users []models.User // Ensure users is always initialized

	return users, nil
}
