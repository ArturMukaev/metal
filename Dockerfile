# build stage
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json separately
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# production stage
FROM node:20-alpine AS production-stage

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone build from build stage
COPY --from=build-stage /app/.next/standalone ./
COPY --from=build-stage /app/.next/static ./.next/static
COPY --from=build-stage /app/public ./public

# Install nginx
RUN apk add --no-cache nginx

# Create nginx directory if it doesn't exist and copy configuration
RUN mkdir -p /etc/nginx/http.d /var/log/nginx /var/cache/nginx /var/lib/nginx/tmp && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/lib/nginx/tmp

# Copy nginx configuration
COPY nginx/default.conf /etc/nginx/http.d/default.conf

# Create basic nginx.conf if it doesn't exist
RUN echo 'user nginx;' > /etc/nginx/nginx.conf && \
    echo 'worker_processes auto;' >> /etc/nginx/nginx.conf && \
    echo 'error_log /var/log/nginx/error.log warn;' >> /etc/nginx/nginx.conf && \
    echo 'pid /var/run/nginx.pid;' >> /etc/nginx/nginx.conf && \
    echo 'events {' >> /etc/nginx/nginx.conf && \
    echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/http.d/*.conf;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

# Create startup script that runs both Node.js and nginx
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "Starting Next.js server..."' >> /start.sh && \
    echo 'node server.js &' >> /start.sh && \
    echo 'NODE_PID=$!' >> /start.sh && \
    echo 'echo "Waiting for Next.js to be ready..."' >> /start.sh && \
    echo 'sleep 3' >> /start.sh && \
    echo 'for i in 1 2 3 4 5 6 7 8 9 10; do' >> /start.sh && \
    echo '  if nc -z localhost 3000 2>/dev/null; then' >> /start.sh && \
    echo '    echo "Next.js is ready!"' >> /start.sh && \
    echo '    break' >> /start.sh && \
    echo '  fi' >> /start.sh && \
    echo '  echo "Waiting for Next.js... ($i/10)"' >> /start.sh && \
    echo '  sleep 1' >> /start.sh && \
    echo 'done' >> /start.sh && \
    echo 'echo "Starting nginx..."' >> /start.sh && \
    echo 'exec nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Install netcat for health check
RUN apk add --no-cache netcat-openbsd

EXPOSE 80

CMD ["/start.sh"]

