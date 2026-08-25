FROM node:22-alpine

RUN corepack enable
RUN corepack prepare pnpm@10.16.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]