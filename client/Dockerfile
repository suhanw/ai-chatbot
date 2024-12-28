ARG NODE_VERSION=22.7.0
FROM node:${NODE_VERSION}-alpine AS base 

# Dependencies image
FROM base AS dependencies
WORKDIR /usr/src/app
COPY package*.json ./
# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm ci --include=dev
# Copy the rest of the source files into the image.
COPY . .
