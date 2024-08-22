FROM golang:1.22-alpine


WORKDIR /go/src/awms-be

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go install github.com/cosmtrek/air@latest

CMD ["air", "-c", ".air.toml"]