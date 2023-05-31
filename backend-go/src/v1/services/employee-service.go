package services

import (
	"errors"
	"github.com/bcgov/quickstart-openshift/backend-go/src/database"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/entities"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/repositories"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/structs"
	"github.com/devfeel/mapper"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"strconv"
)

var userRepo = repositories.NewUserRepository(database.DBConn)

func GetUsers(c *fiber.Ctx) error {
	d := &[]entities.UserEntity{}
	err := database.DBConn.Find(&d).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return c.Status(200).JSON(make([]string, 0))
	} else if err != nil {
		return c.Status(500).JSON(err)
	} else if len(*d) < 1 {
		return c.Status(200).JSON(make([]string, 0))
	}
	var users []structs.User
	for _, element := range *d {
		var emp = new(structs.User)
		err = mapper.AutoMapper(&element, emp)
		if err != nil {
			break
		}
		users = append(users, *emp)
	}

	if err != nil {
		return c.Status(500).JSON(err)
	}
	return c.JSON(users)
}

func GetUserById(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}
	userRepo := repositories.NewUserRepository(database.DBConn)
	userEntity, err := userRepo.GetById(uint(id))
	var user = new(structs.User)
	err = mapper.AutoMapper(&userEntity, user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func CreateUser(c *fiber.Ctx) error {
	var userDto structs.User
	if err := c.BodyParser(&userDto); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	userEntity := entities.UserEntity{
		Name:  userDto.Name,
		Email: userDto.Email,
	}

	if err := userRepo.Create(&userEntity); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	var user = new(structs.User)
	_ = mapper.AutoMapper(&userEntity, user)
	return c.Status(fiber.StatusCreated).JSON(user)
}

func UpdateUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	userEntity, err := userRepo.GetById(uint(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if userEntity == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	var user structs.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	userEntity.Name = user.Name
	userEntity.Email = user.Email

	if err := userRepo.Update(userEntity); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	var updatedUser = new(structs.User)
	_ = mapper.AutoMapper(&userEntity, updatedUser)
	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func DeleteUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	userEntity, err := userRepo.GetById(uint(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if userEntity == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	if err := userRepo.Delete(userEntity); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusNoContent).JSON(nil)
}

/*
func GetUserAddresses(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	user, err := models.GetUserById(uint(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	addresses, err := models.GetUserAddresses(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"addresses": addresses,
	})
}

func GetUserAddressById(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	addressId, err := strconv.Atoi(c.Params("addressId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	user, err := models.GetUserById(uint(userId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	address, err := models.GetUserAddressById(uint(addressId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if address == nil || address.UserID != uint(userId) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Address not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"address": address,
	})
}

func CreateUserAddress(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	user, err := models.GetUserById(uint(userId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	var addressDto services.UserAddressDto
	if err := c.BodyParser(&addressDto); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	address := models.UserAddress{
		Street:  addressDto.Street,
		City:    addressDto.City,
		State:   addressDto.State,
		ZipCode: addressDto.ZipCode,
		UserID:  uint(userId),
	}

	if err := models.CreateUserAddress(&address); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Address created successfully",
		"address": address,
	})
}

func UpdateUserAddress(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	addressId, err := strconv.Atoi(c.Params("addressId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	user, err := models.GetUserById(uint(userId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	address, err := models.GetUserAddressById(uint(addressId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if address == nil || address.UserID != uint(userId) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Address not found",
		})
	}

	var addressDto services.UserAddressDto
	if err := c.BodyParser(&addressDto); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	address.Street = addressDto.Street
	address.City = addressDto.City
	address.State = addressDto.State
	address.ZipCode = addressDto.ZipCode

	if err := models.UpdateUserAddress(address); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Address updated successfully",
		"address": address,
	})
}

func DeleteUserAddress(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	addressId, err := strconv.Atoi(c.Params("addressId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	user, err := models.GetUserById(uint(userId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	address, err := models.GetUserAddressById(uint(addressId))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if address == nil || address.UserID != uint(userId) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Address not found",
		})
	}

	if err := models.DeleteUserAddress(address); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Address deleted successfully",
	})
}*/
