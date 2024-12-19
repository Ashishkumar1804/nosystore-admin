#Use the official Node.js image with Alpine Linux for a small image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the .env file and the rest of your application code
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Expose port 80 (or the port you plan to serve the Angular app)
EXPOSE 4000

# Use a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Serve the application
CMD ["http-server", "dist/nosyStore/browser", "-p", "4000"]
