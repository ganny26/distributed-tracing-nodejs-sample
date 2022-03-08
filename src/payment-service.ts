import init from './tracer'
const { sdk } = init('payment-service')
import 'dotenv/config'
import * as api from '@opentelemetry/api'
import axios from 'axios'
import * as express from 'express'
import * as cors from 'cors'

const app = express()
app.use(cors())
app.use((request, response, next) => {
  next()
})

app.get('/payment/transfer/id/:id', async (req, res) => {
  try {
    if (!!req.query.amount) {
      axios
        .put(`http://localhost:8081/user/${req.params.id}`, {
          AMOUNT: req.query.amount,
        })
        .then((result) => {
          console.log('result', result.data)
          res.send(result.data)
        })
    } else {
      throw new Error('Amount is required')
    }
  } catch (e) {
    console.log('error', e.message)
    const activeSpan = api.trace.getSpan(api.context.active())
    console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId })
    activeSpan.recordException(e)
    res.sendStatus(500)
  }
})

app.listen(process.env.PAYMENT_PORT)
console.log(`payment services is up and running on port ${process.env.PAYMENT_PORT}`)
