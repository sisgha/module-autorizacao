FROM node:18 as base
RUN apt update -y
RUN apt install -y git
WORKDIR /sisgea/env-dev/modules/backend-module-autorizacao

FROM base as prod-deps
COPY package.json .npmrc package-lock.json ./
RUN npm install --omit=dev

FROM prod-deps as dev-deps
RUN npm install

FROM dev-deps as assets
COPY . .
RUN npm run build
RUN rm -rf node_modules

FROM prod-deps
COPY --from=assets /sisgea/env-dev/modules/backend-module-autorizacao /sisgea/env-dev/modules/backend-module-autorizacao
WORKDIR /sisgea/env-dev/modules/backend-module-autorizacao
CMD npm run db:migrate && npm run seed:run && npm run start:prod
