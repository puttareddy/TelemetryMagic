# Overview

OpenTelemetry Express Instrumentation allows the user to automatically collect trace data and export them to the backend of choice (we can use Zipkin or Jaeger for this example), to give observability to distributed systems.

This is a simple example that demonstrates tracing calls made to Express API. The example
shows key aspects of tracing such as

- Root Span (on Client)
- Child Span (on Client)
- Span Events
- Span Attributes

## Installation

```sh
# from this directory
npm install
```

Setup [Zipkin Tracing](https://zipkin.io/pages/quickstart.html)
or
Setup [Jaeger Tracing](https://www.jaegertracing.io/docs/latest/getting-started/#all-in-one)

## Run the Application

- Run the app as an individual server

    ```shell script
    # from this directory
    cd src
    npm run dev
    ```

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more information on OpenTelemetry for Node.js, visit: <https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-node>

## LICENSE

Apache License 2.0
