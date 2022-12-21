FROM node:16-bullseye
LABEL maintainer="Ricardo Montania Prado de Campos <ricardo.campos@encora.com>"

RUN yarn global add serve@14.1.2

WORKDIR /app
RUN groupadd -g 10001 app && \
   useradd -u 10000 -g app app \
   && chown -R app:app /app

USER app:app

COPY build/ .

EXPOSE 3000

CMD serve -s .
