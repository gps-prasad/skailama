# Use an official Node.js runtime as a base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package*.json (both package.json and package-lock.json)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (your app should use a variable for the port if needed)
EXPOSE 3001

# Define the command to run your application
CMD [ "npm", "start" ]
