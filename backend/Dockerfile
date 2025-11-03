FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

ENV NODE_OPTIONS="--loader ts-node/esm"
CMD ["npx", "ts-node", "--project", "tsconfig.json", "--esm", "src/server.ts"]
