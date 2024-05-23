package errors

import "net/http"

type HTTPError struct {
	StatusCode int    `json:"-"`
	Message    string `json:"message"`
}

func (e *HTTPError) Error() string {
	return e.Message
}

func NewNotFoundError(message string) *HTTPError {
	return &HTTPError{
		StatusCode: http.StatusNotFound,
		Message:    message,
	}
}
