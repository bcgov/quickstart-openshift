# Use the official Ubuntu base image
FROM ubuntu:latest

WORKDIR /app
ENV DIRECTORIES=/app

# Install necessary packages
RUN apt-get update && \
    apt-get install -y \
    bash \
    curl \
    ca-certificates \
    openssh-client \
    tar \
    gzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install OpenShift CLI (oc)
RUN curl -L https://mirror.openshift.com/pub/openshift-v4/clients/oc/latest/linux/oc.tar.gz -o /tmp/oc.tar.gz && \
    tar -xzf /tmp/oc.tar.gz -C /tmp && \
    mv /tmp/oc /usr/local/bin/oc

# Verify installation
RUN /usr/local/bin/oc version --client && \
    curl --version && \
    bash --version

COPY . .
RUN chmod +x create-update-secrets.sh
ENTRYPOINT ["/app/create-update-secrets.sh"]