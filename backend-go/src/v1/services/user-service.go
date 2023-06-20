package services

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/bcgov/quickstart-openshift/backend-go/src/database"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/entities"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/repositories"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/structs"
	"github.com/devfeel/mapper"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

const userNotFound = "User not found"
const addressNotFound = "Address not found"

var (
	userRepo     *repositories.UserRepository
	userAddrRepo *repositories.UserAddressRepository
)

func Init() {
	userRepo = repositories.NewUserRepository(database.DBConn)
	userAddrRepo = repositories.NewUserAddressRepository(database.DBConn)
}

// GetUsers godoc
// @Summary Get all Users
// @Description Get all Users
// @Tags Users
// @Accept json
// @Produce json
// @Success 200 {object} structs.ResponseHTTP{data=[]structs.User}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users [get]
func GetUsers(c *fiber.Ctx) error {
	d := &[]entities.UserEntity{}
	err := database.DBConn.Find(&d).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return c.Status(200).JSON(make([]string, 0))
	} else if err != nil {
		return internalServerError(c, err.Error())
	} else if len(*d) < 1 {
		return c.Status(200).JSON(make([]string, 0))
	}
	var users []structs.User
	for _, element := range *d {
		user := createUserFromUserEntity(&element)
		if err != nil {
			break
		}
		users = append(users, *user)
	}

	if err != nil {
		return internalServerError(c, err.Error())
	}
	return success(c, "Got All the users", users, http.StatusOK)
}

// GetUserById godoc
// @Summary Get user by ID
// @Description Get user from the database by ID
// @Tags Users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} structs.ResponseHTTP{data=structs.User}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id} [get]
func GetUserById(c *fiber.Ctx) error {
	id, conversionErr := strconv.Atoi(c.Params("id"))
	if conversionErr != nil {
		return badRequest(c, conversionErr.Error())
	}
	userRepo := repositories.NewUserRepository(database.DBConn)
	userEntity, repoErr := userRepo.GetById(uint(id))

	if repoErr != nil {
		return internalServerError(c, repoErr.Error())
	}
	if userEntity == nil {
		return notFound(c, userNotFound)
	}
	user := createUserFromUserEntity(userEntity)
	return success(c, "Got the user", *user, http.StatusOK)
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user in the database
// @Tags Users
// @Accept json
// @Produce json
// @Param user body structs.User true "User object"
// @Success 201 {object} structs.ResponseHTTP{data=structs.User}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users [post]
func CreateUser(c *fiber.Ctx) error {
	var userDto structs.User
	if err := c.BodyParser(&userDto); err != nil {
		return badRequest(c, err.Error())
	}

	userEntity := new(entities.UserEntity)
	userEntity.Name = userDto.Name
	userEntity.Email = userDto.Email

	if err := userRepo.Create(userEntity); err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_key\"") {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"message": "User with this email already exists",
			})
		}
		return internalServerError(c, err.Error())
	}
	user := createUserFromUserEntity(userEntity)
	return success(c, "Created the user", *user, http.StatusCreated)
}

// UpdateUser godoc
// @Summary Update an existing user
// @Description Update an existing user in the database
// @Tags Users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body structs.User true "User object"
// @Success 200 {object} structs.ResponseHTTP{data=structs.User}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id} [put]
func UpdateUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	userEntity, err := userRepo.GetById(uint(id))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if userEntity == nil {
		return notFound(c, userNotFound)
	}

	var user structs.User
	if err := c.BodyParser(&user); err != nil {
		return badRequest(c, err.Error())
	}

	userEntity.Name = user.Name
	userEntity.Email = user.Email

	if err := userRepo.Update(userEntity); err != nil {
		return internalServerError(c, err.Error())
	}
	updatedUser := createUserFromUserEntity(userEntity)
	return success(c, "Updated the user", *updatedUser, http.StatusOK)
}

func createUserFromUserEntity(userEntity *entities.UserEntity) *structs.User {
	var updatedUser = new(structs.User)
	updatedUser.Id = userEntity.Id
	updatedUser.Name = userEntity.Name
	updatedUser.Email = userEntity.Email
	return updatedUser
}

// DeleteUser godoc
// @Summary Delete a user
// @Description Delete a user from the database by ID
// @Tags Users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 204 "No Content"
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id} [delete]
func DeleteUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	userEntity, err := userRepo.GetById(uint(id))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if userEntity == nil {
		return notFound(c, userNotFound)
	}

	if err := userRepo.Delete(userEntity); err != nil {
		return internalServerError(c, err.Error())
	}

	return success(c, "Deleted the user", nil, http.StatusNoContent)
}

// GetUserAddresses godoc
// @Summary Get user addresses
// @Description Get all addresses for a user from the database
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} structs.ResponseHTTP{data=[]structs.UserAddress}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id}/addresses [get]
func GetUserAddresses(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	user, err := userRepo.GetById(uint(id))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if user == nil {
		return notFound(c, userNotFound)
	}

	var userAddresses []structs.UserAddress
	for _, element := range user.Addresses {
		var userStruct = new(structs.UserAddress)
		err = mapper.AutoMapper(&element, userStruct)
		if err != nil {
			break
		}
		userAddresses = append(userAddresses, *userStruct)
	}
	if err != nil {
		return internalServerError(c, err.Error())
	}
	return success(c, "Got the user addresses", userAddresses, http.StatusOK)
}

// GetUserAddressByAddressId godoc
// @Summary Get user address by address ID
// @Description Get a user address from the database by address ID
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path int true "Address ID"
// @Success 200 {object} structs.ResponseHTTP{data=structs.UserAddress}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id}/addresses/{addressId} [get]
func GetUserAddressByAddressId(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return badRequest(c, err.Error())
	}
	addressId, err := strconv.Atoi(c.Params("addressId"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	user, err := userRepo.GetById(uint(userId))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if user == nil {
		return notFound(c, userNotFound)
	}

	address, err := userAddrRepo.GetUserAddressByAddressId(uint(addressId))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if address == nil || address.UserID != uint(userId) {
		return notFound(c, addressNotFound)
	}
	addressStruct := createAddressStructFromEntity(address)
	return success(c, "Got the user address by id", addressStruct, http.StatusOK)
}

func createAddressStructFromEntity(address *entities.UserAddressEntity) *structs.UserAddress {
	var addressStruct = new(structs.UserAddress)
	addressStruct.Id = address.Id
	addressStruct.UserID = address.UserID
	addressStruct.City = address.City
	addressStruct.Street = address.Street
	addressStruct.ZipCode = address.ZipCode
	addressStruct.State = address.State
	return addressStruct
}

// CreateUserAddress godoc
// @Summary Create a user address
// @Description Create a new user address in the database
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param address body structs.UserAddress true "Address information"
// @Success 201 {object} structs.ResponseHTTP{data=structs.UserAddress}
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id}/addresses [post]
func CreateUserAddress(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	user, err := userRepo.GetById(uint(userId))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if user == nil {
		return notFound(c, userNotFound)
	}

	var addressDto structs.UserAddress
	if err := c.BodyParser(&addressDto); err != nil {
		return badRequest(c, err.Error())
	}

	address := entities.UserAddressEntity{
		Street:  addressDto.Street,
		City:    addressDto.City,
		State:   addressDto.State,
		ZipCode: addressDto.ZipCode,
		UserID:  uint(userId),
	}

	if err := userAddrRepo.CreateUserAddress(&address); err != nil {
		return internalServerError(c, err.Error())
	}
	addressStruct := createAddressStructFromEntity(&address)
	return success(c, "Created User Address", addressStruct, http.StatusCreated)
}

// DeleteUserAddress godoc
// @Summary Delete a user address
// @Description Delete a user address from the database by ID
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path int true "Address ID"
// @Success 204 "No Content"
// @Failure 404 {object} structs.ResponseHTTP{}
// @Failure 503 {object} structs.ResponseHTTP{}
// @Failure 500 {object} structs.ResponseHTTP{}
// @Router /api/v1/users/{id}/addresses/{id} [delete]
func DeleteUserAddress(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	addressId, err := strconv.Atoi(c.Params("addressId"))
	if err != nil {
		return badRequest(c, err.Error())
	}

	user, err := userRepo.GetById(uint(userId))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if user == nil {
		return notFound(c, userNotFound)
	}

	address, err := userAddrRepo.GetUserAddressByAddressId(uint(addressId))
	if err != nil {
		return internalServerError(c, err.Error())
	}

	if address == nil || address.UserID != uint(userId) {
		return notFound(c, addressNotFound)
	}

	if err := userAddrRepo.DeleteUserAddress(address); err != nil {
		return internalServerError(c, err.Error())
	}

	return success(c, "Deleted User Address", nil, http.StatusNoContent)
}
func notFound(c *fiber.Ctx, message string) error {
	return c.Status(http.StatusNotFound).JSON(structs.ResponseHTTP{
		Success: false,
		Message: message,
		Data:    nil,
	})
}

func badRequest(c *fiber.Ctx, message string) error {
	return c.Status(http.StatusBadRequest).JSON(structs.ResponseHTTP{
		Success: false,
		Message: message,
		Data:    nil,
	})
}

func internalServerError(c *fiber.Ctx, message string) error {
	return c.Status(http.StatusInternalServerError).JSON(structs.ResponseHTTP{
		Success: false,
		Message: message,
		Data:    nil,
	})
}
func success(c *fiber.Ctx, message string, data interface{}, status int) error {
	return c.Status(status).JSON(structs.ResponseHTTP{
		Success: true,
		Message: message,
		Data:    data,
	})
}
