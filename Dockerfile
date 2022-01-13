FROM registry.access.redhat.com/ubi8/ubi
RUN dnf module install -y nodejs:14
WORKDIR /app
COPY . .
RUN npm ci
CMD npm start
