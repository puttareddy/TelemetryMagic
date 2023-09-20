#!/bin/bash

[ -z "$JAVA_XMS" ] && JAVA_XMS=2048m
[ -z "$JAVA_XMX" ] && JAVA_XMX=2048m

set -e

# OpenTelemetry:
# https://github.com/open-telemetry/opentelemetry-java-instrumentation
JAVA_OPTS="${JAVA_OPTS} \
  -Xms${JAVA_XMS} \
  -Xmx${JAVA_XMX} \
  -Dapplication.name=${APP_NAME} \
  -Dapplication.home=${APP_HOME} \
  -Dotel.metrics.exporter=none \
  -Dotel.traces.exporter=zipkin \
  -Dotel.exporter.zipkin.endpoint=http://zipkin-all-in-one:9411/api/v2/spans \
  -Dotel.resource.attributes=service.name=spring-boot \
  -javaagent:${APP_HOME}/opentelemetry-javaagent-all.jar"

exec java ${JAVA_OPTS} \
  -jar "${APP_HOME}/${APP_NAME}.jar" \
  --spring.config.location=/config/application.yml
