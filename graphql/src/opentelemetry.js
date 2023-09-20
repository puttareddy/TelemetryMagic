/* opentelemetry.js */
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { AlwaysOnSampler } = require("@opentelemetry/core");


// const OTLPoptions = {
//     _serviceName: 'putt-nodejs-quickstart',
//     url: "https://eub584.dynatrace-managed.com/e/5330b34c-6dd5-466a-8aa7-e75e9e5535e0/api/v2/otlp/v1/traces", //TODO Replace <URL> to your SaaS/Managed-URL as mentioned in the next step
//     //https://{your-domain}/e/{your-environment-id}/api/v2/otlp/v1/traces
//     headers: {
//         Authorization: "Api-Token xxxx.xxxxx.xxxx" //TODO Replace <TOKEN> with your API Token as mentioned in the next step
//     },
// };
// const collectorExporter = new CollectorTraceExporter(OTLPoptions);


dtmetadata = new Resource({})
for (var name of [ 'dt_metadata_e617c525669e072eebe3d0f08212e8f2.properties', '/var/lib/dynatrace/enrichment/dt_metadata.properties' ]) {
    try {
        dtmetadata = new Resource(propertiesReader(fs.readFileSync(name).toString()).getAllProperties())
        break
    } catch (e) {}
}

const collectorExporter = new CollectorTraceExporter({
    url: 'http://localhost:55678/v1/traces',
  });

const sdk = new opentelemetry.NodeSDK({
    sampler: new AlwaysOnSampler(),
    traceExporter: collectorExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'putt-nodejs-quickstart', //TODO Replace with the name of your application
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.1', //TODO Replace with the version of your application
    }).merge(dtmetadata),
});

sdk.start()