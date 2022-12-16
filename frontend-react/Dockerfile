FROM node:16-bullseye
LABEL maintainer="Paulo Gomes da Cruz Junior <paulo.cruz@encora.com>"

RUN yarn global add serve@14.1.2 react-inject-env@2.1.0

WORKDIR /app
COPY build/ .

EXPOSE 3000

RUN chmod -R g+w .

CMD react-inject-env set -d . && serve -s .
