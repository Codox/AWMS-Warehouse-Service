package controllers

import (
	"awms-be/internal/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DangerousGoodsController struct {
	dangerousGoodsService *services.DangerousGoodsService
}

func NewDangerousGoodsController(dangerousGoodsService *services.DangerousGoodsService) *DangerousGoodsController {
	return &DangerousGoodsController{dangerousGoodsService: dangerousGoodsService}
}

func (dgc *DangerousGoodsController) GetDangerousGoods(c *gin.Context) {
	dangerousGoods, err := dgc.dangerousGoodsService.GetDangerousGoods()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, dangerousGoods)
}
