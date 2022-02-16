import { Resource } from '@opentelemetry/resources'
import * as opentelemetry from '@opentelemetry/sdk-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-grpc')
const { MySQL2Instrumentation } = require('@opentelemetry/instrumentation-mysql2')

const init = function (serviceName: string) {
  // Define traces
  const traceExporter = new OTLPTraceExporter({})

  const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations(), new MySQL2Instrumentation()],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  })

  sdk
    .start()
    .then(() => console.log('Tracing initialized'))
    .catch((error) => console.log('Error initializing tracing', error))

  // You can also use the shutdown method to gracefully shut down the SDK before process shutdown
  // or on some operating system signal.
  const process = require('process')
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(
        () => console.log('SDK shut down successfully'),
        (err) => console.log('Error shutting down SDK', err)
      )
      .finally(() => process.exit(0))
  })
  return { sdk }
}

export default init
