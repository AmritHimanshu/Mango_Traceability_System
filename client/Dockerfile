FROM node:22

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --legacy-peer-deps

COPY . .

ENTRYPOINT [ "npm", "run", "dev" ]