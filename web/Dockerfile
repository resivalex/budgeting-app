FROM node:20-alpine

WORKDIR /app

# Add package.json and yarn.lock files first
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Add all source files
COPY . .

# Build the React app
RUN yarn build

# Install serve to host the static files
RUN yarn add serve

# Command to run the server
CMD ["yarn", "run", "serve", "--single", "build", "--listen", "tcp://0.0.0.0:3000"]
