FROM golang:1.15-alpine as builder
RUN apk add --no-cache ca-certificates git
WORKDIR /src

COPY . .
RUN go build -gcflags='-N -l' -o /order-processor .

FROM alpine as release
RUN apk add --no-cache ca-certificates
COPY --from=builder /order-processor /order-processor
ENTRYPOINT ["/order-processor"]