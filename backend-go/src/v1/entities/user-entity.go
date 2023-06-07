package entities

func (UserEntity) TableName() string {
	return "go_api.users"
}
func (UserAddressEntity) TableName() string {
	return "go_api.user_addresses"
}

type UserEntity struct {
	Id        uint                `gorm:"primaryKey;autoIncrement"`
	Name      string              `gorm:"not null"`
	Email     string              `gorm:"not null;unique"`
	Addresses []UserAddressEntity `gorm:"foreignKey:UserID"`
}

type UserAddressEntity struct {
	Id      uint   `gorm:"primaryKey;autoIncrement"`
	Street  string `gorm:"not null"`
	City    string `gorm:"not null"`
	State   string `gorm:"not null"`
	ZipCode string `gorm:"not null"`
	UserID  uint   `gorm:"not null"`
}
