
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';

import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const setupOpenTelemetry = (serviceName) => {
  const providerWithZone = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const collector_url = process.env.COLLECTOR_HOST || 'localhost:55678';
  const traceExporter = new OTLPTraceExporter({
    url: `http://${collector_url}/v1/traces`,
  });


  providerWithZone.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
  providerWithZone.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  providerWithZone.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

  providerWithZone.register({
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    tracerProvider: providerWithZone,
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

  return providerWithZone;
}

export default setupOpenTelemetry