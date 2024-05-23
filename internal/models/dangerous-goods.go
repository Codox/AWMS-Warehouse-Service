package models

import (
	"time"
)

type DangerousGoods struct {
	ID              uint                           `gorm:"primaryKey"`
	UUID            string                         `gorm:"type:uuid;default:uuid_generate_v4();unique"`
	UnClass         string                         `json:"un_class"`
	DangerousGoods  string                         `json:"dangerous_goods"`
	CreatedAt       time.Time                      `json:"created_at"`
	UpdatedAt       time.Time                      `json:"updated_at"`
	Classifications []DangerousGoodsClassification `gorm:"foreignKey:DangerousGoodsID" json:"classifications"`
}

type DangerousGoodsClassification struct {
	ID               uint      `gorm:"primaryKey"`
	UUID             string    `gorm:"type:uuid;default:uuid_generate_v4();unique"`
	Division         string    `json:"division"`
	Classification   string    `json:"classification"`
	DangerousGoodsID uint      `json:"dangerous_goods_id"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}
