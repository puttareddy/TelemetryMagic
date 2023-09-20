# Overview

OpenTelemetry Instrumentation allows the user to automatically collect Traces/Spans data and export them to the backend of choice (Zipkin and/or Dynatrace in this example), to provide Observability on distributed systems.

This sample application demonstrates OpenTelemetry Tracing between `React --> Express --> Spring Boot --> GraphQL` applications, which shows key aspects of tracing such as

- Root Span (on Client)
- Child Span (on Client)
- Span Events
- Span Attributes

Each Trace/Span information will be collected & expored to Ziplin & Dynatrace APM tools via OpenTelemetry Collecter & Exporter libraries.

## Why do we need to consider OpenTelemerty(Optl)?

Even though Distributed Tracing is one of the Out-of-Box (OOB) feature from few APM tools (like Dynatrace), we need to consider Optl because 

1. <b> Standard solution API :</b> Prior to OpenTelemetry, the process of capturing and transmitting application telemetry data was fragmented with a range of disparate open and vendor-provided solutions.
2. <b> Vendor agnostic: </b> Traditional approaches to telemetry data collection required teams to manually instrument code, which locked users into specific tools. As a result, the cost of switching was high. So, if a customer adopted a solution that worked for monolithic apps but not cloud apps, moving to a more modern offering was challenging.
3. <b> Pre-instrumented code : </b> Application tracing is critical to help users identify application issues and areas for improvement. Manually instrumenting code to export trace data can be challenging because it can require extensive testing cycles and code validation. With SaaS software, manual instrumentation may not even be possible.
4. Tracing can be enabled for Front End frameworks like React, Nextjs etc., via Optl, which provides more visibility not only distributed tracing but also to findout Largest Contentful Paint (LCP), First Contentful Paint (FCP), First Meaningful Paint (FMP)  etc.,

In a nutshell, It standardizes the way telemetry data is collected and transmitted to any backend platforms of choice

## What does this REPO bring to the table?

This REPO helps to standarize the solution across various Telus Digial (TD) frameworks on

1. <b>Adaption Strategy</b> How to inject these configurations into various platforms like WASK, React, NextJS, api-starter-kits, express, graphql, SpringBoot etc.,
2. <b> Provider configuraitons:</b>  Need to determine what kind of traces are these: server-side vs website. Based on this Intrumention approach would change
3. <b> Auto vs Manual:</b>  To determine to go with Auto Instrumentions or manual to avoid Performance hit. Based on the framework of choice need to register providers to instrument accordingly
4. <b> Simple vs batch spans:</b>  Need to determine the span processors.. simple vs batch mode 
5. <b> Filter requests:</b>  If you want to filter some of the requests. for example health check endpoints etc.,
6. Really need to instrument FE applications also, as they are origin for Traces. This REPO explains how to create/enable spans approved Telus Digital frameworks like ReactJS, NextJS etc.,
7. <b> Privacy requirements: </b> if you want to mask any sensitive details.. create span attributes, only those will be tracked

<b>Interested?</b> Follow [Architecture](./docs/Architecture.md) to know more...

## Prerequisites

1. To export the Distributed Traces to <b>Dynatrace</b>, Please connect to Telus VPN and have the `API_Token` updated under `/config/.env.dev` . Floow this [guide](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-ingest#create-token) to create the token accordingly.
2. For <b>GCP Trace</b>, have the `Service Account` keys handy & keep that under root of the project as `keys.json` , so that it will be mounted during the Server start. Follow this [guide](https://cloud.google.com/trace/docs/setup/nodejs-ot) to enable Traces for a given GCP project.

## Setup the Application

Follow below instrcutions to spin-up the application

- Clone the REPO
- Build the Application

   ```sh
   # from this directory
   $ docker-compose --env-file ./config/.env.dev build
   ```

- Start the Application

   ```sh
   # from this directory
   docker-compose --env-file ./config/.env.dev up
   ```

- Stop the Application

   ```sh
   # from this directory
   docker-compose --env-file ./config/.env.dev down
   ```

## Run the Application

After Application starts, load the React application using below URL and navigate through button clicks

   ```sh
   # from browser, tigger below URL
   http://localhost:3000/
   ```

Optionally, you can trigger Express & GraphQL endpoints using below URLs to trace those applications individually

   ```sh
   # from browser, tigger express endpoint 
   http://localhost:8081/run_test  

   # from browser, trigger graphql endpoint
   http://localhost:4000/ 
   ```

Once these endpoints are triggered, Trace information will be availabe in [Zipkin](https://zipkin.io/pages/quickstart.html) & [Dynatrace](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry) accordingly

## See the Magic

Refer bleow Monitioring Tools on how a Distributed Tracing can be viewed for the given request between different distributed systems.

### Zipkin UI

React application should output the `traceid` in the terminal (e.g `traceid: 4815c3d576d930189725f1f1d1bdfcc6`).
Go to Zipkin with your browser <http://localhost:9411/zipkin/traces/(your-trace-id)> (e.g <http://localhost:9411/zipkin/traces/4815c3d576d930189725f1f1d1bdfcc6>)

<p align="center"><img src="./images/zipkin.png?raw=true"/></p>

### Dynatrace UI

To access the trace details, follow below steps

```
Note: You should connect to VPN to upload the Trace Details to Dynatrace. Otherwise, you will not be able to find them in Dynatrace APM tool
```

1. Login to [Dynatrace](https://eub584.dynatrace-managed.com/e/5330b34c-6dd5-466a-8aa7-e75e9e5535e0/ui/data-explorer?gtf=-30m&gf=all&referer=NAVIGATION_MENU) with SSO
2. In left navigation menu, Navigate to  `Applications & MicroServcies` --> `Distributed Traces` section
3. In `Filter Requests:` Search with above traceid against `W3C trace ID` in filter criteria
4. You can see the sample tracing as below

<p align="center"><img src="./images/dynatrace.png?raw=true"/></p>

### <b>Note</b>

There are couple of approaches to enable Distributed Tracing in Dynatrace APM Tool

#### <b>Approach#1</b>
<b>Without OneAgent + OpenTelemetry</b> -  Currently, we export the traces using <b>CollectorTraceExporter</b> as this example runs Without OneAgent configurations. 

#### <b>Approach#2</b>
<b> With OneAgent + OpenTelemetry (Recommended) </b>  - Follow below steps to enable Distributed Traceing via OneAgent + OpenTelemetry
1. For APIs, Enable OpenTelemetry in Dynatrace by navigating to this path<b> Settings --> Server-side service monitoring --> Deep monitoring --> Expand New OneAgent features --> Find and enable OpenTelemetry (Node.js) [here](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-trace-oneagent#expand--opentelemetry-node-js--3). </b>
2. For Front-end frameworks, enable the Real User Monitoring to capture [XHR actions](https://www.dynatrace.com/support/help/shortlink/capture-xhr-actions#activate-generic-javascript-frameworks-support) (optional)
3. We can use Auto Instrumentation to capature the traces and spans. Manual Instrumenentation is also possible, if customized data needs to be exported 
4. Send data via [OneAgent](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-nodejs#send) 

 Refer [these docs](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-nodejs#send) for more details.
<b>Recommendation</b> is to go with [OpenTelemetry + OneAgent](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-trace-oneagent) Configurations

In any case, from Dev Standpoint the implemenation pattern is same in both approaches except comment out the <b>CollectorTraceExporter</b> [reference](https://github.com/telus/observability-demo/blob/main/express/src/tracer.js#L45-L51) code.

### Google Cloud Trace UI

Distributed Tracing can be done in mulitple ways. Refer more details [here](https://cloud.google.com/trace/docs/setup/nodejs-ot)

1. Auto Instrumentation for Node.js, Web applications
2. Manual tracing

Only point to consider between Auto vs Manual instrumention is, there will be little bit of performance overhead, if we go with Auto Instrumention, which is developer friendly.

Traces can be exported in couple of ways to GCP

1. via OpenTelemetry - The implementation you see in this PoC
2. via Cloud Trace Library - You can find reference [here](https://cloud.google.com/trace/docs/setup/nodejs)

Refer [these docs](https://cloud.google.com/trace/docs/setup) to get more details about the GCP Traces.

<p align="center"><img src="./images/trace.png?raw=true"/></p>

## Adaption Strategy

This section talks about various Adaption Strategies based on the framework used in Telus Digital. Follow [Adaption](./docs/Adaption.md) to know more...

## What Next?

- Enterprise agreement on the PoC
- Onboard these components with the help of Platform teams into various StaterKits
- Do a PoC, how the traces/spans (headers) information is carry forward between multiple Infra components like F5, Load balancer, CDN, Ingress proxy etc.,  
- Need to dig more for client side apps for various frameworks like NextJS, React etc.,
- Current limitations for React are <b>a)</b> GCP trace work only for Server-Side rendering <b>b)</b> Need to enable React framework in Dynatrace. Also, need help for Dynatrace team
- Need to drive the similar approach from OneAgent Perspective

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more information on OpenTelemetry for Node.js, visit: <https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-node>
- GCP Trace: <https://cloud.google.com/trace/docs/setup/nodejs-ot>
- Dynatrace: <https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-nodejs#tabgroup--send-data-to-dynatrace--without-oneagent>
- Nextjs + Opentelemetry: <https://github.com/prisma/pdp-spike-nextjs-opentelemetry/>
