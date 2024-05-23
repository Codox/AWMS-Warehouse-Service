package models

import (
	"time"
)

type DangerousGoods struct {
	ID              uint                           `gorm:"primaryKey" json:"-"`
	UUID            string                         `gorm:"type:uuid;default:uuid_generate_v4();unique" json:"uuid"`
	UnClass         string                         `json:"un_class"`
	DangerousGoods  string                         `json:"dangerous_goods"`
	CreatedAt       time.Time                      `json:"created_at"`
	UpdatedAt       time.Time                      `json:"updated_at"`
	Classifications []DangerousGoodsClassification `gorm:"foreignKey:DangerousGoodsID" json:"classifications"`
}

type DangerousGoodsClassification struct {
	ID               uint      `gorm:"primaryKey" json:"-"`
	UUID             string    `gorm:"type:uuid;default:uuid_generate_v4();unique" json:"uuid"`
	Division         string    `json:"division"`
	Classification   string    `json:"classification"`
	DangerousGoodsID uint      `json:"-"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}
