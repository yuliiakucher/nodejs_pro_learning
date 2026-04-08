1. як запустити;   
   запускаємо через dev:  
   `docker compose -f docker-compose.dev.yml up`
2. яка топологія;  
   **exchanges**  - є один dlx exchange  
   **queues**  - 3 queues:  
   main - orders.process  
   retry - orders.retry  
   dlq - orders.dlq  
   **routing keys**  
   dead_letter and retry  


   orders queue -> retry queue  
   retry queue -> main queue    
   (3 retries)   
   main queue -> dlq

3. який retry-механізм обрано;

- with retry queue and dlq queue
- Збергіємо в хедері кількість attempts
- 5s delay between attempts
- якщо >3 attempts --> відправляємо в dlq

4. як відтворити 4 сценарії;  
   мануально змінити в src/orders/orders.service.ts:120 messageId на вже існуючий
5. як реалізована idempotency.

створено processed_messages таблицю з unique messageId. Якщо запис з таким messageId вже існує, то не сворюємо новий, але ack месседж.
