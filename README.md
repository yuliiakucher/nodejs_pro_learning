## Description

NestJS learning project covering REST, GraphQL, auth, file uploads, messaging, and microservices.

## Architecture

Two services communicating via gRPC:

- **main-service** — orders, products, users, auth (JWT), file uploads (MinIO), GraphQL + REST
- **payment-service** — standalone gRPC server that authorizes payments

Order flow: `POST /orders` → gRPC call to payment-service → result published to RabbitMQ → consumer updates order status

## Running locally

Start with dev docker colpose:
```bash
docker compose -f docker-compose.dev.yml up
```

Copy `.env.example` to `.env` and fill in values before starting.

## Happy path

```bash
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-idempotency-key: unique-key-123" \
  -d '{
    "user": "USER_ID",
    "deliveryAddress": "123 Main St",
    "cartItems": [{ "productId": "PRODUCT_ID", "quantity": 1 }]
  }'
```

## Auth

**JWT** — access + refresh token pair issued on `POST /auth/login`. Access token expires in 15m; use `POST /auth/refresh` to rotate both tokens (refresh token is hashed with argon2 in the DB).

**RBAC** — roles are stored in the DB and embedded in the JWT payload as claim names. Use `@Roles('role-name')` + `RolesGuard` to restrict a route.

Current protected routes:
| Route | Guard |
|---|---|
| `DELETE /orders/:id` | JWT + `support` role |
| `GET /users` | JWT |
| `POST/GET /files` | JWT |

To get a token:
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "password" }'
```

## GraphQL

Schema-first approach — `.graphql` files define the contract, NestJS generates TypeScript types from them.

Orders query supports filtering (`status`, `dateFrom`, `dateTo`) and pagination (`limit`/`offset`), returning `{ nodes, totalCount, pageInfo }`.

**DataLoader** is used to batch relation lookups and eliminate N+1 queries. Example for fetching 5 orders with items and products:

- Without DataLoader: ~25 individual SELECT queries (one per relation per order)
- With DataLoader: 4 queries total (orders + statuses batched by ID + items batched by orderId + products batched by ID)

GraphQL playground available at `http://localhost:8080/graphql`.

Example query:
```graphql
query Orders($filter: OrdersFilterInput, $pagination: OrdersPaginationInput) {
  orders(filter: $filter, pagination: $pagination) {
    nodes {
      id
      orderStatus { name }
      createdAt
      orderItems {
        quantity
        product { id title price }
      }
    }
    pageInfo { offset limit }
    totalCount
  }
}
```

## File uploads

Files are stored in MinIO (S3-compatible). Flow:

1. `POST /files/presign` — server generates a presigned PUT URL and creates a `FileRecord` with status `PENDING`
2. Client uploads directly to MinIO using the presigned URL (no traffic through the server)
3. `POST /files/complete` — server verifies access and marks the record as `READY`
4. `GET /files/:id` — server generates a presigned GET URL for download

Access control: JWT required; only the file owner or a user with `admin`/`support` role can complete or retrieve a file.

## Docker

Multi-stage Dockerfile with three targets:

| Target | Use | Size |
|---|---|---|
| `deps` | local dev (mounted volume) | ~821MB |
| `prod` | standard production | ~465MB |
| `prod-distroless` | production default | ~452MB |

`prod-distroless` uses `gcr.io/distroless/nodejs22` — no shell, no OS tools, smaller attack surface. Runs as non-root (UID 65532).

To run the full prod stack locally:
```bash
docker compose up
```

## Notable features

- Idempotent order creation (via `x-idempotency-key` header)
- Pessimistic locking on product stock during order transaction
- RabbitMQ retry queue (3 retries, 5s delay) + dead-letter queue
- Exactly-once message processing via `processed_messages` dedup table

## Proto

`proto/payments.proto` is the shared contract. The payment-service loads it as the gRPC server, main-service loads it as the client (`main-service/src/payments/payments.module.ts`).

## CI/CD

Three GitHub Actions workflows:

**`pr-checks.yml`** — runs on every PR: lint, unit tests, Docker build (no push).

**`build-and-stage.yml`** — runs on merge to `main`: builds the distroless image, pushes to AWS ECR with both a commit SHA tag and a `stage` tag, generates a release manifest artifact (commit, digest, timestamp), then force-deploys the staging ECS service and hits `/health` to verify.

**`deploy-prod.yml`** — manual trigger only, requires GitHub environment approval. Retags the `stage` image as `prod` in ECR (no rebuild), force-deploys the prod ECS service, and hits `/health`.

```
PR → pr-checks (lint + test + build)
merge to main → build-and-stage → ECR :stage → ECS staging
manual trigger → deploy-prod → ECR :prod → ECS prod
```

## AWS

- **ECR** — Docker image registry. Two tags in use: `stage` (latest merged) and `prod` (last manually promoted).
- **ECS** — runs the containerized app. Separate services for staging and prod environments.

## Project setup

```bash
npm install
```

Run migrations:
```bash
npm run migration:run
```