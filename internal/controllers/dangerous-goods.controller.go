package controllers

import (
	"awms-be/internal/errors"
	"awms-be/internal/services"
	"awms-be/internal/utils"
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

func (dgc *DangerousGoodsController) GetDangerousGoodsByUuid(c *gin.Context) {
	uuid := c.Param("uuid")
	dangerousGoods, err := dgc.dangerousGoodsService.GetDangerousGoodsByUuid(uuid)
	if err != nil {
		utils.HandleHTTPError(c, errors.DangerousGoodsNotFoundError(uuid))
		return
	}

	c.JSON(http.StatusOK, dangerousGoods)
}

func (dgc *DangerousGoodsController) GetDangerousGoodsClassificationsByUuid(c *gin.Context) {
	uuid := c.Param("uuid")
	dangerousGoods, err := dgc.dangerousGoodsService.GetDangerousGoodsByUuid(uuid)
	if err != nil {
		utils.HandleHTTPError(c, errors.DangerousGoodsNotFoundError(uuid))
		return
	}

	c.JSON(http.StatusOK, dangerousGoods.Classifications)
}
