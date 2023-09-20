const {
    ConsoleSpanExporter,
    SimpleSpanProcessor
  } = require('@opentelemetry/tracing')
  const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
  const { NodeTracerProvider } = require('@opentelemetry/node')
  const { registerInstrumentations } = require('@opentelemetry/instrumentation')
  const { Resource } = require('@opentelemetry/resources');
  const { SemanticAttributes, SemanticResourceAttributes: ResourceAttributesSC } = require('@opentelemetry/semantic-conventions');
  const { AlwaysOnSampler } = require('@opentelemetry/core');
  const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-proto');
  const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');
  const { TraceExporter} = require("@google-cloud/opentelemetry-cloud-trace-exporter");
  const opentelemetry = require('@opentelemetry/api');
  
  const collector_url = process.env.COLLECTOR_HOST || 'localhost:55678';
  const dyna_url= process.env.DYNATRACE_URL || 'undefined';
  const dyna_api_token= process.env.DYNATRACE_API_TOKEN || 'undefined';

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributesSC.SERVICE_NAME]: 'fastify-service',
    }),
    sampler: filterSampler(ignoreHealthCheck, new AlwaysOnSampler()),
  });
  
  const serviceName = "fastify-server";

  const dynaExporter = new CollectorTraceExporter({
    _serviceName: serviceName,
    url: `${dyna_url}`,  
    headers: {
        Authorization: `Api-Token ${dyna_api_token}`
    },
  });
  //provider.addSpanProcessor(new SimpleSpanProcessor(dynaExporter));
  
  const traceExporter = new OTLPTraceExporter({
    serviceName,
    url: `http://${collector_url}/v1/traces`,
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));

  // Initialize the exporter. When your application is running on Google Cloud,
  // you don't need to provide auth credentials or a project id.
  const gcpExporter = new TraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(gcpExporter));

  provider.register()
  
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation()
    ]
  })

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