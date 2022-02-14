import init from './tracer'
const { sdk } = init('order-service')
import 'dotenv/config'
import * as api from '@opentelemetry/api'
import axios from 'axios'
import * as express from 'express'
import { db, initializeDB } from './model'

initializeDB((mysql: any) => {
  console.log('db initialized')
  mysql.sequelize.sync().then(() => {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    //Create order
    app.post('/order/create', (req, res) => {
      try {
        if (!!req.body.USER_ID) {
          axios.get(`http://localhost:8081/user/${req.body.USER_ID}`).then(async (result) => {
          let { ACCOUNT, AMOUNT } = result.data
            console.log(AMOUNT)
            const orderPayload = {
              ACCOUNT: ACCOUNT,
              PRODUCT_NAME: req.body.PRODUCT_NAME,
              PRICE: req.body.PRICE,
              ORDER_STATUS: 'SUCCESS',
            }
            const paymentData = {
              AMOUNT: parseInt(AMOUNT) - parseInt(req.body.PRICE),
            }
            let order = await db.OrdersTable.create(orderPayload)
            let updateBalance = await db.UserTable.update(paymentData,{where:{ID:req.body.USER_ID}})
            res.send(order)
          }).catch(err=>{
            const activeSpan = api.trace.getSpan(api.context.active())
            console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId })
            activeSpan.recordException(err.message)
            res.sendStatus(500)
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

    app.listen(process.env.ORDER_PORT)
    console.log(`order services is up and running on port ${process.env.ORDER_PORT}`)
  })
})
