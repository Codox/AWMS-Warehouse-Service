package routes

import (
	"awms-be/internal/controllers"
	"awms-be/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	// userService := services.NewUserService(pool)
	dangerousGoodsService := services.NewDangerousGoodsService(db)
	dangerousGoodsController := controllers.NewDangerousGoodsController(dangerousGoodsService)
	// userController := controllers.NewUserController(userService)

	router.GET("/dangerous-goods", dangerousGoodsController.GetDangerousGoods)
}
