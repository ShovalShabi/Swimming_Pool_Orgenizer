# Dockerfile
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json .

# Install build dependencies and tools
RUN apk --no-cache add \
    build-base \
    python3 \
    && npm install -g nodemon \
    && npm install \
    && apk del build-base python3  # Remove build dependencies after installation

# Install dependencies
RUN npm install

# Copy application code
COPY . .