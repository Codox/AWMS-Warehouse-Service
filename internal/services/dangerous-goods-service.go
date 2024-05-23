package services

import (
	"awms-be/internal/models"
	"gorm.io/gorm"
)

type DangerousGoodsService struct {
	db *gorm.DB
}

func NewDangerousGoodsService(db *gorm.DB) *DangerousGoodsService {
	return &DangerousGoodsService{db: db}
}

func (dgs *DangerousGoodsService) GetDangerousGoods() ([]models.DangerousGoods, error) {
	var dangerousGoods []models.DangerousGoods // Ensure dangerousGoods is always initialized

	err := dgs.db.Preload("Classifications").Find(&dangerousGoods).Error
	if err != nil {
		return nil, err
	}
	return dangerousGoods, nil
}

func (dgs *DangerousGoodsService) GetDangerousGoodsByUuid(uuid string) (*models.DangerousGoods, error) {
	var dangerousGoods models.DangerousGoods // Ensure dangerousGoods is always initialized

	err := dgs.db.Preload("Classifications").Where("uuid = ?", uuid).First(&dangerousGoods).Error
	if err != nil {
		return nil, err
	}
	return &dangerousGoods, nil
}
