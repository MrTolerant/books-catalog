FROM node:15-buster
CMD npm run start

WORKDIR /app

COPY package*.json ./
RUN npm config set strict-ssl false && \
    npm ci
COPY . .
