package routes

import (
	"awms-be/internal/controllers"
	"awms-be/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupRoutes(router *gin.Engine, client *mongo.Client) {
	userService := services.NewUserService(client)
	userController := controllers.NewUserController(userService)

	router.GET("/users", userController.GetAllUsers)
}
