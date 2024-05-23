package routes

import (
	"awms-be/internal/controllers"
	"awms-be/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupRoutes(router *gin.Engine, pool *pgxpool.Pool) {
	userService := services.NewUserService(pool)
	userController := controllers.NewUserController(userService)

	router.GET("/users", userController.GetAllUsers)
}
