package routes

import (
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/services"
	"github.com/gofiber/fiber/v2"
)

func EmployeeRoutes(app fiber.Router) {
	r := app.Group("/users")

	// @Summary Get all users
	// @Description Get all users
	// @Tags users
	// @Produce json
	// @Success 200 {object} []User
	// @Router / [get]
	r.Get("/", services.GetUsers)

	// @Summary Get a user by ID
	// @Description Get a user by ID
	// @Tags users
	// @Produce json
	// @Param id path int true "User ID"
	// @Success 200 {object} User
	// @Router /{id} [get]
	r.Get("/:id", services.GetUserById)

	// @Summary Create a user
	// @Description Create a user
	// @Tags users
	// @Accept json
	// @Produce json
	// @Param user body User true "User object"
	// @Success 201 {object} User
	// @Router / [post]
	r.Post("/", services.CreateUser)

	// @Summary Update a user by ID
	// @Description Update a user by ID
	// @Tags users
	// @Accept json
	// @Produce json
	// @Param id path int true "User ID"
	// @Param user body User true "User object"
	// @Success 200 {object} User
	// @Router /{id} [put]
	r.Put("/:id", services.UpdateUser)

	// @Summary Delete a user by ID
	// @Description Delete a user by ID
	// @Tags users
	// @Param id path int true "User ID"
	// @Success 204
	// @Router /{id} [delete]
	r.Delete("/:id", services.DeleteUser)

	// @Summary Get all user addresses
	// @Description Get all user addresses
	// @Tags users
	// @Accept json
	// @Produce json
	// @Param id path int true "User ID"
	// @Success 200 {array} Address
	// @Router /{id}/addresses [get]
	r.Get("/:id/addresses", services.GetUserAddresses)
	// @Summary Retrieve a user address by ID
	// @Description Retrieve a user address by ID
	// @Tags users
	// @Accept json
	// @Produce json
	// @Param id path int true "User ID"
	// @Param addressId path int true "Address ID"
	// @Success 200 {object} Address
	// @Router /{id}/addresses/{addressId} [get]
	r.Get("/:id/addresses/:addressId", services.GetUserAddressByAddressId)

	// @Summary Create a new user address
	// @Description Create a new user address
	// @Tags users
	// @Accept json
	// @Produce json
	// @Param id path int true "User ID"
	// @Param address body Address true "Address object"
	// @Success 201 {object} Address
	// @Router /{id}/addresses [post]
	r.Post("/:id/addresses", services.CreateUserAddress)
	// @Summary Delete a user address by ID
	// @Description Delete a user address by ID
	// @Tags users
	// @Param id path int true "User ID"
	// @Param addressId path int true "Address ID"
	// @Success 204
	// @Router /{id}/addresses/{addressId} [delete]
	r.Delete("/:id/addresses/:addressId", services.DeleteUserAddress)

}
