# Stage 1: build
FROM node:20-bullseye-slim AS build

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including dev for TS compilation)
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npm run build

# Stage 2: production image
FROM node:20-bullseye-slim

WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy compiled JS from build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose port
EXPOSE 3000

CMD ["node", "dist/src/main.js"]   
