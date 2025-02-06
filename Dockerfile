FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY src/ src/
COPY tsconfig.json tsconfig.json

CMD ["npm", "run", "build:dev"]
