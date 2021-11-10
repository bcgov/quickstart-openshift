FROM image-registry.apps.silver.devops.gov.bc.ca/openshift/nodejs:14-ubi8
WORKDIR /app
COPY ./index.js ./package.json ./package-lock.json ./
RUN npm ci
EXPOSE 8080
CMD node index.js
