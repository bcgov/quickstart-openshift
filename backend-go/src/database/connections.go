package database

import (
	"fmt"
	"github.com/bcgov/quickstart-openshift/backend-go/src/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"strconv"
	"time"
)

var (
	// DBConn is a pointer to gorm.DB
	DBConn *gorm.DB
)

func Connect() (err error) {
	user := utils.GetEnv("POSTGRES_USER", "postgres")
	password := utils.GetEnv("POSTGRES_PASSWORD", "postgres")
	host := utils.GetEnv("POSTGRES_HOST", "localhost")
	db := utils.GetEnv("POSTGRES_DATABASE", "postgres")
	port := utils.GetEnv("POSTGRES_PORT", "5432")
	maxConnections := utils.GetEnv("DB_MAX_CONNECTIONS", "10")
	maxIdleConnections := utils.GetEnv("DB_MAX_IDLE_CONNECTIONS", "2")
	portNum, err := strconv.Atoi(port)
	if err != nil {
		return err
	}

	dsn := fmt.Sprintf("user=%s password=%s host=%s dbname=%s port=%d sslmode=disable", user, password, host, db, portNum)
	DBConn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	sqlDB, err := DBConn.DB()
	maxIdle, err := strconv.Atoi(maxIdleConnections)
	maxDBCon, err := strconv.Atoi(maxConnections)
	sqlDB.SetMaxIdleConns(maxIdle)
	sqlDB.SetMaxOpenConns(maxDBCon)
	sqlDB.SetConnMaxLifetime(time.Minute * 5)

	return nil
}
