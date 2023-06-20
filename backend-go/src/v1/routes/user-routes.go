package routes

import (
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/services"
	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app fiber.Router) {
	r := app.Group("/api/v1/users")
	services.Init()
	r.Get("/", services.GetUsers)
	r.Get("/:id", services.GetUserById)
	r.Post("/", services.CreateUser)
	r.Put("/:id", services.UpdateUser)
	r.Delete("/:id", services.DeleteUser)
	r.Get("/:id/addresses", services.GetUserAddresses)
	r.Get("/:id/addresses/:addressId", services.GetUserAddressByAddressId)
	r.Post("/:id/addresses", services.CreateUserAddress)
	r.Delete("/:id/addresses/:addressId", services.DeleteUserAddress)
}
