# High-Performance Decoupled WebCMD + Grok-4.20 Background Worker
FROM node:20-alpine AS worker

WORKDIR /app

# Install system dependencies for headless Chromium & PDF processing
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["node", "-e", "console.log('⚡ WebCMD + Grok-4.20 Worker daemon listening to Redis queue...')"]
