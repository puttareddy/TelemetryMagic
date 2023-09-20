import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BaseOpenTelemetryComponent } from '@opentelemetry/plugin-react-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { diag, DiagConsoleLogger } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
// const TraceExporter = require("@google-cloud/opentelemetry-cloud-trace-exporter");

const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
// const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-proto');
const { AlwaysOnSampler } = require('@opentelemetry/core');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const opentelemetry = require('@opentelemetry/api');
const { SemanticAttributes, SemanticResourceAttributes: ResourceAttributesSC } = require('@opentelemetry/semantic-conventions');

const collector_url = process.env.COLLECTOR_HOST || 'localhost:55678';
const dyna_url = process.env.DYNATRACE_URL || 'undefined';
const dyna_api_token = process.env.DYNATRACE_API_TOKEN || 'undefined';

console.log('dyna_url-----' + dyna_url);

export default (serviceName) => {
  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    }),
    sampler: filterSampler(ignoreHealthCheck, new AlwaysOnSampler()),
  });


  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      getWebAutoInstrumentations({
        // load custom configuration for xml-http-request instrumentation
        '@opentelemetry/instrumentation-xml-http-request': {
          propagateTraceHeaderCorsUrls: [
            /.+/g,
          ],
        },
        // load custom configuration for fetch instrumentation
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: [
            /.+/g,
          ],
        },
        // load custom configuration for fetch instrumentation
        '@opentelemetry/instrumentation-http': {
          propagateTraceHeaderCorsUrls: [
            /.+/g,
          ],
        },
      }),
    ],
  });

  const exporter = new OTLPTraceExporter({
    url: `http://${collector_url}/v1/traces`,
  });

  // Dynatrace to be added to loop
  // const dynaExporter = new CollectorTraceExporter({
  //   _serviceName: "graphql-server",
  //   url: `${dyna_url}`,  
  //   headers: {
  //       Authorization: `Api-Token ${dyna_api_token}`
  //   },
  // });
  // provider.addSpanProcessor(new SimpleSpanProcessor(dynaExporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  // Initialize the exporter. When your application is running on Google Cloud,
  // you don't need to provide auth credentials or a project id.
  // const gcpExporter = new TraceExporter();
  // provider.addSpanProcessor(new SimpleSpanProcessor(gcpExporter));

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  const tracer = provider.getTracer(serviceName);

  BaseOpenTelemetryComponent.setTracer(serviceName)
  diag.setLogger(new DiagConsoleLogger());

  return tracer;
}
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