FROM node:19-alpine

ARG NODE_ENV=production

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm install --omit=dev

COPY . .
CMD [ "npm", "run", "start" ]