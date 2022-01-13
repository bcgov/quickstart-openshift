FROM registry.access.redhat.com/ubi8/ubi
RUN dnf module install -y nodejs:14
WORKDIR /app
USER 1001
COPY . .
RUN npm ci
CMD npm start
