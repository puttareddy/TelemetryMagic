# NOTE: Users must mount the Spring config file to /config/application.yml.
FROM maven:3.8.5-openjdk-11-slim AS build
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN mvn clean
RUN mvn -e package spring-boot:repackage -DskipTests


FROM openjdk:11-jre
LABEL maintainer="Puttaiah Arugunta"

ENV APP_NAME demo
ENV APP_HOME /app/bin

RUN mkdir -p ${APP_HOME}

COPY --from=build /project/target/${APP_NAME}-*.jar ${APP_HOME}/${APP_NAME}.jar
COPY ./tmp/opentelemetry-javaagent-all.jar ${APP_HOME}/
COPY ./scripts/start-app.sh ${APP_HOME}/

WORKDIR ${APP_HOME}

ENTRYPOINT [ "./start-app.sh" ]
