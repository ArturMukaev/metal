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

# Copy nginx configuration
COPY nginx/default.conf /etc/nginx/http.d/default.conf

# Create startup script that runs both Node.js and nginx
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'node server.js &' >> /start.sh && \
    echo 'exec nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]

