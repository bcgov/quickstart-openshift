FROM golang:1.20 AS build
WORKDIR /workspace/app
# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && \
    go mod verify
# required for swagger generation
RUN go install github.com/swaggo/swag/cmd/swag@latest
COPY . .
RUN swag init && swag fmt
RUN mkdir  -p /workspace/app/target/application
RUN CGO_ENABLED=0 GOOS=linux go build -v -o /workspace/app/target/application ./...
HEALTHCHECK --interval=3000s --timeout=30s CMD go version || exit 1

FROM alpine:3.18
ARG DEPENDENCY=/workspace/app/target/application
RUN apk add --no-cache bash
RUN addgroup -S appgroup && adduser -S 1001 -G appgroup
USER 1001
COPY --chown=1001 --from=build ${DEPENDENCY}/backend-go /usr/local/bin/application
EXPOSE 3000
HEALTHCHECK --interval=300s --timeout=3s CMD curl -f http://127.0.0.1/:3000
ENTRYPOINT  ["application"]
