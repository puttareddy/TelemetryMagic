'use strict';

const opentelemetry = require('@opentelemetry/api');

// Not functionally required but gives some insight what happens behind the scenes
const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const { AlwaysOnSampler } = require('@opentelemetry/core');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { Resource } = require('@opentelemetry/resources');
const { SemanticAttributes, SemanticResourceAttributes: ResourceAttributesSC } = require('@opentelemetry/semantic-conventions');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-proto');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');
const { TraceExporter} = require("@google-cloud/opentelemetry-cloud-trace-exporter");

const Exporter = (process.env.EXPORTER || '').toLowerCase().startsWith('z') ? ZipkinExporter : JaegerExporter;
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const collector_url = process.env.COLLECTOR_HOST || 'localhost:55678';
const dyna_url= process.env.DYNATRACE_URL || 'undefined';
const dyna_api_token= process.env.DYNATRACE_API_TOKEN || 'undefined';

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributesSC.SERVICE_NAME]: serviceName,
    }),
    sampler: filterSampler(ignoreHealthCheck, new AlwaysOnSampler()),
  });
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      HttpInstrumentation,
      ExpressInstrumentation,
    ],
  });

  const dynaExporter = new CollectorTraceExporter({
    _serviceName: "express-server",
    url: `${dyna_url}`,  
    headers: {
        Authorization: `Api-Token ${dyna_api_token}`
    },
  });
  
  const traceExporter = new OTLPTraceExporter({
    serviceName,
    url: `http://${collector_url}/v1/traces`,
  });

  
  provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(dynaExporter));

  // Initialize the exporter. When your application is running on Google Cloud,
  // you don't need to provide auth credentials or a project id.
  const gcpExporter = new TraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(gcpExporter));
  provider.register();

  return opentelemetry.trace.getTracer('express-example');
};

function filterSampler(filterFn, parent) {
  return {
    shouldSample(ctx, tid, spanName, spanKind, attr, links) {
      if (!filterFn(spanName, spanKind, attr)) {
        return { decision: opentelemetry.SamplingDecision.NOT_RECORD };
      }
      return parent.shouldSample(ctx, tid, spanName, spanKind, attr, links);
    },
    toString() {
      return `FilterSampler(${parent.toString()})`;
    }
  }
}

function ignoreHealthCheck(spanName, spanKind, attributes) {
  return spanKind !== opentelemetry.SpanKind.SERVER || attributes[SemanticAttributes.HTTP_ROUTE] !== "/health";
}