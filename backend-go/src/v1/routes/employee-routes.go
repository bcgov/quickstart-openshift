package routes

import (
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/services"
	"github.com/gofiber/fiber/v2"
)

func EmployeeRoutes(app fiber.Router) {
	r := app.Group("/api/v1/users")

	r.Get("/", services.GetUsers)
	r.Get("/:id", services.GetUserById)
	r.Post("/", services.CreateUser)
	r.Put("/:id", services.UpdateUser)
	r.Delete("/:id", services.DeleteUser)

	/*	r.Get("/:id/addresses", services.GetUserAddresses)
		r.Get("/:id/addresses/:addressId", services.GetUserAddressById)
		r.Post("/:id/addresses", services.CreateUserAddress)
		r.Put("/:id/addresses/:addressId", services.UpdateUserAddress)
		r.Delete("/:id/addresses/:addressId", services.DeleteUserAddress)*/

}
