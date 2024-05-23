package utils

import (
	"awms-be/internal/errors"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HandleHTTPError(ctx *gin.Context, err error) {
	if httpErr, ok := err.(*errors.HTTPError); ok {
		ctx.JSON(httpErr.StatusCode, gin.H{"error": httpErr.Message})
	} else {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
	}
}
