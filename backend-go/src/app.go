package src

import (
	"fmt"
	_ "github.com/bcgov/quickstart-openshift/backend-go/docs"
	"github.com/bcgov/quickstart-openshift/backend-go/src/database"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/helmet/v2"
	"github.com/gofiber/swagger" // swagger handler
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// App godoc
// @version 1.0
// @title Quickstart OpenShift Example GO API with Fiber
// @description Quickstart OpenShift Example GO API with Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /
func App() *fiber.App {
	_ = godotenv.Load()
	logrus.SetFormatter(&logrus.TextFormatter{
		ForceColors:   true,
		FullTimestamp: true,
	})
	logrus.SetLevel(logrus.DebugLevel)
	dbErr := database.Connect()
	if dbErr != nil {
		err := fmt.Errorf("error: %v", dbErr)
		fmt.Println(err.Error())
		logrus.Fatalf("Error: %v", dbErr)
	}
	app := fiber.New(fiber.Config{})
	app.Use(helmet.New())
	app.Use(favicon.New())
	app.Use(recover.New())
	app.Use(cors.New())

	app.Use(logger.New(logger.Config{
		TimeFormat: "2006-01-02T15:04:05",
		TimeZone:   "America/Vancouver",
	}))
	app.Get("/", HealthCheck)
	routes.UserRoutes(app)
	// Serve Swagger documentation
	app.Get("/swagger/*", swagger.HandlerDefault) // default
	app.Use(monitor.New())
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) // => 404 "Not Found"
	})
	return app
}

// HealthCheck godoc
// @Summary Health Check
// @Description Check the health of the server and database
// @Tags health
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {string} string "Database connection error"
// @Router /health [get]
func HealthCheck(c *fiber.Ctx) error {
	sqlDB, err := database.DBConn.DB()
	err = sqlDB.Ping()
	if err != nil {
		logrus.Errorf("Error: %v", err)
		return c.Status(500).SendString("Database connection error")
	}
	res := map[string]interface{}{
		"server": "Running",
		"db":     "Running",
	}
	if err := c.JSON(res); err != nil {
		return err
	}
	return nil
}
