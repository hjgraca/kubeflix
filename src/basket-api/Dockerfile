FROM golang:1.15-alpine as builder
RUN apk add --no-cache ca-certificates git
WORKDIR /src

# restore dependencies
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -gcflags='-N -l' -o /basket-api .

FROM alpine as release
RUN apk add --no-cache ca-certificates
COPY --from=builder /basket-api /basket-api
ENTRYPOINT ["/basket-api"]