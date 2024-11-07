# Use the penultimate stable version of Alpine as the base image
FROM alpine:3.17

# Pass each application path
ARG APP_PATH

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY ${APP_PATH}/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY $APP_PATH .

# Start the application
CMD ["node", "server.js"]