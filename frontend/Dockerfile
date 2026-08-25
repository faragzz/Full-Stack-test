FROM node:22-alpine

# Enable pnpm
RUN corepack enable && \
    corepack prepare pnpm@10.16.1 --activate

WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]