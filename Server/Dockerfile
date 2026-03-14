FROM golang:1.26-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

# 依存関係を先にコピーしてキャッシュを活用
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピーしてビルド
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# ---- Run Stage ----
FROM alpine:latest

# セキュリティ用の非rootユーザーを作成
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# ビルド済みバイナリだけをコピー
COPY --from=builder /app/server .

# 非rootユーザーで実行
USER appuser

EXPOSE 8080

CMD ["./server"]

# ---- Dev Stage (ホットリロード用) ----
FROM golang:1.26-alpine AS dev

RUN apk add --no-cache git
# air: Goのホットリロードツール
RUN go install github.com/air-verse/air@latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

EXPOSE 8080

CMD ["air"]
