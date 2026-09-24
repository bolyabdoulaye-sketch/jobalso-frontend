FROM node:20-slim AS builder

WORKDIR /code

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* doit être fourni au build, car Next.js l'inline dans le bundle client.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

FROM node:20-slim AS runner

WORKDIR /code
ENV NODE_ENV=production

COPY --from=builder /code/public ./public
COPY --from=builder /code/.next ./.next
COPY --from=builder /code/node_modules ./node_modules
COPY --from=builder /code/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
