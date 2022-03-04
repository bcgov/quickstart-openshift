
FROM maven:3-jdk-11 as build
WORKDIR /workspace/app

COPY pom.xml .
COPY src ./src
COPY target ./target
#RUN mvn clean package -DskipTests -Dquarkus.package.type=legacy-jar

FROM registry.access.redhat.com/ubi8/openjdk-11-runtime:1.11

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en'
ARG DEPENDENCY=/workspace/app
# Configure the JAVA_OPTIONS, you can add -XshowSettings:vm to also display the heap size.
ENV JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"

COPY --from=build ${DEPENDENCY}/target/lib/* /deployments/lib/
COPY --from=build ${DEPENDENCY}/target/*-runner.jar /deployments/quarkus-run.jar

EXPOSE 8000
USER 185

ENTRYPOINT [ "java", "-jar", "/deployments/quarkus-run.jar" ]
