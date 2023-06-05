package repositories

import (
	"errors"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/entities"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *entities.UserEntity) error {
	result := r.db.Create(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *UserRepository) GetById(id uint) (*entities.UserEntity, error) {
	var user entities.UserEntity
	result := r.db.Preload("Addresses").First(&user, id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	} else if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *UserRepository) Update(user *entities.UserEntity) error {
	result := r.db.Save(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *UserRepository) Delete(user *entities.UserEntity) error {
	result := r.db.Delete(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

type UserAddressRepository struct {
	db *gorm.DB
}

func NewUserAddressRepository(db *gorm.DB) *UserAddressRepository {
	return &UserAddressRepository{db: db}
}

func (r *UserAddressRepository) CreateUserAddress(address *entities.UserAddressEntity) error {
	result := r.db.Create(address)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *UserAddressRepository) GetUserAddressByAddressId(id uint) (*entities.UserAddressEntity, error) {
	var address entities.UserAddressEntity
	result := r.db.First(&address, id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	} else if result.Error != nil {
		return nil, result.Error
	}
	return &address, nil
}

func (r *UserAddressRepository) UpdateUserAddress(address *entities.UserAddressEntity) error {
	result := r.db.Save(address)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *UserAddressRepository) DeleteUserAddress(address *entities.UserAddressEntity) error {
	result := r.db.Delete(address)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
