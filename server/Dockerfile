FROM node:22

WORKDIR /app

ENV PORT=5000

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "dev" ]