FROM node:24-alpine as deps

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

FROM deps as build

RUN npm run build

# Use find to grab all your graphql files and move them to a single 'staging' folder
RUN mkdir -p /app/graphql && \
    chown node:node /app/graphql && \
    find src -name "*.graphql" -exec cp --parents {} /app/graphql \;

RUN rm -rf node_modules

RUN npm ci --omit=dev

FROM node:24-alpine as prod

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node --from=build  /app/dist ./dist
COPY --chown=node:node --from=build  /app/package.json ./
COPY --chown=node:node --from=build  /app/node_modules ./node_modules

COPY --chown=node:node --from=build /app/graphql ./src/graphql

# non-root user
USER node

CMD ["node", "dist/src/main"]

FROM gcr.io/distroless/nodejs22-debian13:nonroot as prod-distroless

WORKDIR /app

COPY --chown=65532:65532 --from=build  /app/dist ./dist
COPY --chown=65532:65532 --from=build  /app/package.json ./
COPY --chown=65532:65532 --from=build  /app/node_modules ./node_modules

COPY --chown=65532:65532 --from=build /app/graphql ./src/graphql

CMD ["dist/src/main.js"]

FROM build as migrations

WORKDIR /app

CMD ["node_modules/.bin/typeorm", "migration:run", "-d", "dist/db/datasource.js"]