# Adaption Strategy
This page explains how to Instrument various frameworks used in Telus Digital (TD).
<< more details to be added >>

Note: For Dynatrace, this solution talks about the `With OneAgent vs Without OneAgent`. The main difference between both options are, Application doesn't need to call out the <b>CollectorTraceExporter</b>  explicitly as the OneAgenet will take care of sending traces to the platform which is the recommended approach.

## Express

Here are the steps needs to be done to onboard Optl into the Starter Kits or TD express App
1. Incorporate the tracer.js file to into the root of the project

```text
https://github.com/telus/observability-demo/blob/main/express/src/tracer.js
```

2. Get the tracer file in server.js as first statement before the server starts

```text
const tracer = require('./tracer')('express-server-side');

https://github.com/telus/observability-demo/blob/main/express/src/server.js#L4 
```

3. Automatically Tracing would be enabled with the configurations provided based on the tracer.js file

## GraphQL

Here are the steps needs to be done to onboard Optl into the TD GraphQL App
1. Incorporate the tracer.js file to into the root of the project

```text
https://github.com/telus/observability-demo/blob/main/graphql/src/tracer.js
```

2. Get the tracer file in server.js as first statement before the server starts

```text
require('./tracer');

https://github.com/telus/observability-demo/blob/main/graphql/src/server-apollo.js#L5
```

3. Automatically Tracing would be enabled with the configurations provided based on the tracer.js file

## React
There are couple of options to enable Tracing in React Application

### Option#1

1. Extend all React Components with `BaseOpenTelemetryComponent`
2. Onboard below trace file into project

```text
https://github.com/telus/observability-demo/blob/main/react/src/web-tracer.js
```

3. Get the tracer file in index.jsx as first statement before the application starts
https://github.com/telus/observability-demo/blob/main/react/src/index.jsx#L9-L10


4. Automatically Tracing would be enabled with the configurations provided based on the web-tracer.js file

### Option#2

Instead of extending every component with `BaseOpenTelemetryComponent`, have a custom implementation with life-cycle hooks in place somethig similar to this https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/plugins/web/opentelemetry-plugin-react-load/src/BaseOpenTelemetryComponent.ts#L115

More details to be added. 

## NextJS
https://github.com/telus/observability-demo/tree/main/nextjs
- In order to use the opentelmentary in your next js application there is an order or operations that you must think about as Next Js is an Isomorphic application. Next Js spools up its on node js and allows us to tap into the server. Opentelementary needs to run from the server as it will allow us to trigger a full life cylce aka e2e testing!

### How To start

```text
import setupOpenTelementary from "./utils/opentelementary";
```

- into your app.js file as it will need to be started at the initial boot of your application.

### Call the tracer

```text
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace
        .getTracer("next-js")
        .startSpan("<next-js>");

      fetch("http://localhost:8081/run_test").then((data) => {
        tracer.end();
      });

        e.preventDefault();
```

- if you look at the react application and how we implemented it. We are using a npm package called 

```code
import opentelemetry from "@opentelemetry/plugin-react-load";
```

- This Plugin is only good up to react 17 and next js is on 18. Being said we have rolled our own implementation to better suit the moving age of technology.

- Its very important to use a class vs A functional component as a class will allow us to render all the right e2e flow to hit zipkin logs

## Spring Boot

Follow below steps to enable OpenTelemetry in Spring-boot applications
1. Include the `OpenTelemetry-javaagenet-all.jar` as java agent while starting the application
2. This jar helps to upload the traces to platform of choice. 
3. otel configurations can updated based on APM tool. For this demo, [zipkin](https://github.com/telus/observability-demo/blob/main/spring-boot/scripts/start-app.sh#L16-L18) is configured 
4. To enable traces in Dynatrace [follow these steps](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-java-auto) after enable Deep monitoring for Java


## Nest.js

<< More details to be added >>

## Fastify

<< More details to be added >>

