FROM node:22-alpine3.19

RUN apk add --no-cache dos2unix

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

RUN dos2unix /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
