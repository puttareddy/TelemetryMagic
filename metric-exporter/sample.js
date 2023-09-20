'use strict';

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { MeterProvider } = require('@opentelemetry/metrics');
const { DynatraceMetricExporter } = require('@dynatrace/opentelemetry-exporter-metrics');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL)

const exporter = new DynatraceMetricExporter({
  prefix: 'putt-sample', // optional

  // If no OneAgent is available locally, export directly to the Dynatrace server:
  // url: 'https://myenv123.live.dynatrace.com/api/v2/metrics/ingest',
  // APIToken: '<load API token from secure location such as env or config file>'
  url:'https://eub584.dynatrace-managed.com/e/5330b34c-6dd5-466a-8aa7-e75e9e5535e0/api/v2/metrics/ingest',
  APIToken:'xxxx.xxxxx.xxxx'

});

const meter = new MeterProvider({
  exporter,
  interval: 1000,
}).getMeter('opentelemetry-metrics-sample-dynatrace');

const requestCounter = meter.createCounter('requests', {
  description: 'Example of a Counter',
});

const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
  description: 'Example of a UpDownCounter',
});

const labels = { pid: process.pid, environment: 'staging' };


setInterval(() => {
  requestCounter.bind(labels).add(1);
  upDownCounter.bind(labels).add(Math.random() > 0.5 ? 1 : -1);
}, 1000);
