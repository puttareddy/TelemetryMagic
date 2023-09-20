'use strict';
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-proto');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { GraphQLInstrumentation } = require('@opentelemetry/instrumentation-graphql');
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes }  = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');
const { TraceExporter} = require("@google-cloud/opentelemetry-cloud-trace-exporter");

const collector_url = process.env.COLLECTOR_HOST || 'localhost:55678';
const dyna_url= process.env.DYNATRACE_URL || 'undefined';
const dyna_api_token= process.env.DYNATRACE_API_TOKEN || 'undefined';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'graphql-service',
  }),
});

const dynaExporter = new CollectorTraceExporter({
  _serviceName: "graphql-server",
  url: `${dyna_url}`,  
  headers: {
      Authorization: `Api-Token ${dyna_api_token}`
  },
});

const traceExporter = new OTLPTraceExporter({
  url: `http://${collector_url}/v1/traces`,
});

provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
provider.addSpanProcessor(new SimpleSpanProcessor(dynaExporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Initialize the exporter. When your application is running on Google Cloud,
// you don't need to provide auth credentials or a project id.
const gcpExporter = new TraceExporter();
provider.addSpanProcessor(new SimpleSpanProcessor(gcpExporter));

provider.register();

registerInstrumentations({
  instrumentations: [
    new GraphQLInstrumentation({
      // allowAttributes: true,
      // depth: 2,
      // mergeItems: true,
    }),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});