FROM node:20-alpine
WORKDIR /app

# Copy package.json and package-lock.json separately
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Build the application and prune dev dependencies in a single step
RUN npm run build && npm prune --production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

