# --- Stage 1: Build Stage ---
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies (including sass) to compile assets
RUN npm install

COPY . .

# Compile SCSS to CSS
RUN npm run start:scss

# --- Stage 2: Production Run Stage ---
FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

# Install ONLY production dependencies (ignores nodemon/concurrently if they were devDependencies, 
# but since they are in 'dependencies', we prune everything we don't need or just copy node_modules)
RUN npm ci --only=production

# Copy application code from the local directory
COPY . .

# Overwrite the Public/css folder with the compiled CSS from the builder stage
COPY --from=builder /usr/src/app/src/Public/css ./src/Public/css

# Use non-root user for security
USER node

EXPOSE 4000

# Run the server directly using node, bypassing the sass compilation script
CMD [ "node", "src/server.ts" ]
