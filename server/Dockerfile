# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server with the appropriate environment
CMD ["npm", "start"]
