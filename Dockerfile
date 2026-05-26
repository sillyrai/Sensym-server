# --- Stage 1: Build Stage ---
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies to get the Sass compiler
RUN npm ci

COPY . .

# Compile SCSS to CSS
RUN npm run start:sass

# --- Stage 2: Production Run Stage ---
FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files first for proper layer caching
COPY package*.json ./

# Install ALL dependencies since ts-node and sass are required at runtime
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Overwrite the Public/css folder with the compiled CSS from the builder stage
COPY --from=builder /usr/src/app/src/Public/css ./src/Public/css

# Use non-root user for security
USER node

EXPOSE 4000

# Run the server using ts-node as defined in your package.json
CMD [ "npm", "run", "start:server" ]