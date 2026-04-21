1. Команди запуску

- dev:  
`docker compose -f docker-compose.dev.yml up`
- prod-like:  
`docker compose up`
- міграції/seed:  
`docker compose run --rm migrate`

2. Оптимізація:

dev - prod -   prod-distroles
```bash
IMAGE                      ID             DISK USAGE   CONTENT SIZE   EXTRA  
node_app:latest            4e164fff4f29        821MB          165MB  
node_app_prod:latest       2bc0a4ce760b        465MB         86.9MB
nest-app:prod-distroless   76d370eebe4f        452MB         85.1MB 
```

Distroless images doesn't include components like shells, OS tools, package managers and debug utils. Because of that they are smaller and more secure (could not be reached via shell)  

3. Перевірка non-root  
В prod image:  
```bash
/ $ whoami  
node
```
В distroless:
```bash
➜  node_pro_course git:(hw10/docker) ✗ docker inspect -f '{{.Config.User}}' ab82c471b7c3ee5058e1587d1c401446aad95711f74049087cb4110f65f8eabb
65532

```
not 0 = non-root user 