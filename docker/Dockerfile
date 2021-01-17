FROM node:14-buster
CMD npm run start

WORKDIR /app

COPY package*.json ./
RUN npm config set strict-ssl false && \
    npm ci
COPY . .
