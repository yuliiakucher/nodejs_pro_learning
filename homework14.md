1. running locally  
make sure postgres and rabbitmq running in docker:  
   ```docker compose -f docker-compose.dev.yml up postgres rabbitmq -d```  
main (orders) service starting with  
```npm run start:dev```  
payment service  
```npm run start:payment:dev```
2. happy path  
create an order -- it will trigger payment service
```curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-idempotency-key: unique-key-123" \
  -d '{
    "user": "USER_ID",
    "deliveryAddress": "123 Main St",
    "cartItems": [
      { "productId": "PRODUCT_ID", "quantity": 1 }
    ]
  }'
  ```
3. proto file
located in the root proto/payments.proto  
   This file is the single source of truth shared between both services.  
   ```payment-service``` (payment-service/src/main.ts) — loads it as the gRPC server  
   ```main-service``` (main-service/src/payments/payments.module.ts) — loads it as the gRPC client
4. Timeout - uncomment snippet in the payment-service/src/payments/payments.service.ts:21 to test the 5s timeout