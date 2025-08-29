FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
