package main

import (
	_ "github.com/bcgov/quickstart-openshift/backend-go/docs"
	"github.com/bcgov/quickstart-openshift/backend-go/src"
	"github.com/bcgov/quickstart-openshift/backend-go/src/v1/structs"
	"github.com/devfeel/mapper"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/sirupsen/logrus"
)

func init() {
	_ = mapper.Register(&structs.User{})
	_ = mapper.Register(&structs.UserAddress{})
}

func main() {
	app := src.App()
	err := app.Listen(":3000")
	if err != nil {
		logrus.Fatalf("Error: %v", err)
		return
	}
}
