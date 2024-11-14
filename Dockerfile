# FROM node:22.3.0

# USER root
# #COPY sources.list /etc/apt/sources.list
# RUN apt-get update && apt-get install -y libaio1 wget unzip

# ADD dist /usr/src/dist
# # ADD config /usr/src/config
# # ADD config /usr/src/dist/config
# # COPY development.env /usr/src/dist/
# # COPY development.env /usr/src/config/
# # WORKDIR /usr/src/dist/src
# WORKDIR /usr/src/dist
# COPY package*.json /usr/src/dist/
# RUN npm install

# # CMD ["node", "./main.js"]

# USER root


# Stage 1: Build the application
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ zeromq zeromq-dev && \
    ln -sf python3 /usr/bin/python && \
    npm install -g npm@10.8.1 node-gyp

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Set environment variable for python
ENV PYTHON=/usr/bin/python3

# Install dependencies with verbose output
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:22-alpine

# Install runtime dependencies
RUN apk add --no-cache zeromq zeromq-dev

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies with verbose output
RUN npm install --only=production --verbose

# Expose the application port
# EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]
