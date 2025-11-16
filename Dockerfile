# Use Node 20 as base image
FROM node:20-bullseye AS dev

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Wrangler dev server port
EXPOSE 8787

# Start development server
CMD ["npm", "run", "dev"]
