FROM node:17-alpine

RUN mkdir -p /app

WORKDIR /app

COPY .env .

COPY package.json .

COPY tsconfig.json .

COPY src ./src

RUN npm install

RUN npm run build

CMD ["node", "build/index.js"]