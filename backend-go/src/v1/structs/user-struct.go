package structs

type User struct {
	Id        uint          `json:"id"`
	Name      string        `json:"name"`
	Email     string        `json:"email"`
	Addresses []UserAddress `json:"addresses"`
}

type UserAddress struct {
	Id      uint   `json:"id"`
	Street  string `json:"street"`
	City    string `json:"city"`
	State   string `json:"state"`
	ZipCode string `json:"zip_code"`
	UserID  uint   `json:"user_id"`
}

// ResponseHTTP represents response body of this API
type ResponseHTTP struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}
