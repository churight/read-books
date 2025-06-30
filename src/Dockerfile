#building frontend

FROM node:18-alpine AS frontend

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

#building backend

FROM node:18-alpine AS backend

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend ./
RUN npm run dev

#final image
FROM node:18-alpine

WORKDIR /app

COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/node_modules ./node_modules
COPY --from=backend /app/backend/package.json ./

COPY --from=frontend /app/frontend/build ./public

EXPOSE 4000

CMD [ "node", "dist/server.js" ]