FROM node:16-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine As production
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN printf "npm run typeorm migration:run\nexport NODE_OPTIONS=--max_old_space_size=250\nnode dist/src/main\n" > entrypoint.sh
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/ormconfig.ts .
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/src/db/migrations ./src/db/migrations

RUN addgroup -S 1001 && adduser -S 1001 -G 1001
USER 1001
EXPOSE 8000
CMD ["/bin/sh", "entrypoint.sh"]
