# Use Node.js for building the React app
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Port for React Dev Server
EXPOSE 3000

CMD ["npm", "start"]