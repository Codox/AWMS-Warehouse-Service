package errors

func DangerousGoodsNotFoundError(uuid string) *HTTPError {
	return NewNotFoundError("Dangerous goods " + uuid + " not found")
}
