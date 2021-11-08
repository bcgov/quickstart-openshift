FROM registry.access.redhat.com/ubi8/ubi-minimal
WORKDIR /app
COPY . .
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
EXPOSE 8080
CMD node index.js
