# Architecture

## OpenTelemetry
The OpenTelemetry project makes robust, portable telemetry a built-in feature of cloud-native software.

High-velocity development and reliable, proactive operations require an effective observability strategy. Rich telemetry is the foundation of cloud-native observability. By connecting best-in-class observability tools to OpenTelemetry, dev and ops gain insights into the reliability and behavior of their applications while maintaining high performance and vendor neutrality in their instrumentation.

There are couple of Approaches to instrument (by considering Dynatrace as preferred APM tool). 

#### <b>Approach#1</b>
<b>Without OneAgent + OpenTelemetry</b> -  Currently, we export the traces using <b>CollectorTraceExporter</b> as this example runs Without OneAgent configurations. 
<p align="center"><img src="../images/architecture.png?raw=true"/></p>

#### <b>Approach#2</b>
<b> With OneAgent + OpenTelemetry (Recommended) </b>  - Follow below steps to enable Distributed Traceing via OneAgent + OpenTelemetry
1. For APIs, Enable OpenTelemetry in Dynatrace by navigating to this path<b> Settings --> Server-side service monitoring --> Deep monitoring --> Expand New OneAgent features --> Find and enable OpenTelemetry (Node.js) [here](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-trace-oneagent#expand--opentelemetry-node-js--3). </b>
2. For Front-end frameworks, enable the Real User Monitoring to capture [XHR actions](https://www.dynatrace.com/support/help/shortlink/capture-xhr-actions#activate-generic-javascript-frameworks-support) (optional)
3. We can use Auto Instrumentation to capature the traces and spans. Manual Instrumenentation is also possible, if customized data needs to be exported 
4. Send data via [OneAgent](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-nodejs#send) 

 Refer [these docs](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-nodejs#send) for more details.
<b>Recommendation</b> is to go with [OpenTelemetry + OneAgent](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-trace-oneagent) Configurations

<p align="center"><img src="../images/dynatrace-approach.png?raw=true"/></p>

In any case, from Dev Standpoint the implemenation pattern is same in both approaches except comment out the <b>CollectorTraceExporter</b> [reference](https://github.com/telus/observability-demo/blob/main/express/src/tracer.js#L45-L51) code.



<b>Note:</b> Solution Approach changes based on the APM tool. Refer main README.md for more details.


## What is Observability and how is it related?

In software, observability generally refers to the ability to understand an application’s behavior and performance based only on its telemetry. Put more simply, observability is what allows you to understand what’s happening in production without changing your code.

In distributed systems, this telemetry can be divided into three overarching flavors:

<p align="center"><img src="../images/Pillars.png?raw=true"/></p>


- [Metrics](./Metrics.md): aggregate statistics (mostly counters and gauges) about processes and infrastructure, typically with key:value tags attached to disaggregate patterns
- Logs: timestamped messages – sometimes structured – emitted by services or other components (though, unlike traces, not necessarily associated with any particular user request or transaction)
- [(Distributed) Traces](./Traces.md): detailed records of the paths that distinct requests take as they propagate across an entire system (including across service boundaries)

Observability is not the same thing as finding a tracing tool, a metrics tool, and a logging tool: it’s about solving problems by putting that telemetry data to work. In this way, <b>you can think of OpenTelemetry as the first step in any observability strategy</b> since high-quality, vendor-neutral data is a great starting point.

## Using OpenTelemetry

While the exact details differ between implementations, the general process of integrating with OpenTelemetry is consistent:

1. First, get your process and core libraries instrumented. Auto-instrumentation is a great first step
2. Validate your instrumentation by sending it to an observability tool like Zeplin, Dynatrace, Google Cloud Monitor etc.,
3. Learn how to troubleshoot instrumentation issues
4. With a good understanding of your telemetry, enrich your data with custom attributes and events
5. Explore advanced topics and best practices to improve collection and analysis

Steps#4 and #5 are ongoing, and should be revisited regularly so you can ensure your telemetry evolves alongside your observability and business needs.
