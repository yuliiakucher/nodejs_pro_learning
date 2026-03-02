- як реалізована транзакція;

транзакція реалізована за допомогою queryRunner: послідовно виконується перевірка idempotencyKey, пошук user, product, створення order_item і order. 

- який механізм конкурентності обрано;

було обрано pessimistic locking - блокувати доступ до транзакції поки вона не завершиться

- як працює ідемпотентність;

при кожному POST запиті клієнт додає в headers унікальний ключ x-idempotency-key. Сервер зберігає його в БД. Якщо такий ключ вже існує - не створюємо новий order, повертаємо вже створений order 

- який запит оптимізували та які індекси додали.

оптимізувала запит findAll products - пошук по title - декоратор @Index()
EXPLAIN ANALYSE SELECT * FROM products WHERE "title" LIKE 'Inc%'

без індекса:
Seq Scan on products  (cost=0.00..36.81 rows=45 width=138) (actual time=0.015..0.115 rows=46.00 loops=1)
Filter: ((title)::text ~~ 'Inc%'::text)
Rows Removed by Filter: 979
Buffers: shared hit=24
Planning Time: 0.077 ms
Execution Time: 0.129 ms


з індексом:
Seq Scan on products
(cost=0.00..36.81 rows=45 width=138) (actual time=0.013..0.119 rows=46.00 loops=1)
Filter: ((title)::text ~~ 'Inc%': :text)
Rows Removed by Filter: 979
Buffers: shared hit=24
Planning Time: 0.079 ms
Execution Time: 0.133 ms

я не бачу різниці - це неправильна реалізація індекса чи замалий обʼєм даних?