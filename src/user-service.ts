import init from './tracer'
const { sdk } = init('user-service')
import 'dotenv/config'
import * as api from '@opentelemetry/api'
import * as express from 'express'
import { db, initializeDB } from './model'
import * as cors from 'cors'

const app = express()

initializeDB((mysql: any) => {
  console.log('db initialized')
  mysql.sequelize.sync().then(() => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    // Create user
    app.post('/user/create', async (req, res) => {
      const userPayload = {
        USER_NAME: req.body.USER_NAME,
        ACCOUNT: req.body.ACCOUNT,
      }
      db.UserTable.create(userPayload)
        .then((result) => {
          res.send(result)
        })
        .catch((err) => {
          res.status(500).send('Error while creating user' + err)
        })
    })

    // Get the user
    app.get('/user/:id', async (req, res) => {
      try {
        db.UserTable.findByPk(req.params.id)
          .then((result) => {
            res.status(200).send(result)
          })
          .catch((err) => {
            res.send(err)
          })
      } catch (e) {
        const activeSpan = api.trace.getSpan(api.context.active())
        console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId })
        activeSpan.recordException(e)
        res.sendStatus(500)
      }
    })
    

    // Update the user
    app.put('/user/:id', async (req, res) => {
      try {
        if (!req.params.id) {
          res.status(400).send({
            message: 'user id can not be empty!',
          })
          return
        }

        const paymentData = {
          AMOUNT: req.body.AMOUNT,
          STATUS: 'SUCCESS',
        }

        console.log(paymentData)

        db.UserTable.update(paymentData, { where: { ID: req.params.id } })
          .then((data) => {
            db.UserTable.findByPk(req.params.id).then((result) => {
              res.send(result)
            })
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || 'Some error occurred while updating the taskData.',
            })
          })
      } catch (e) {
        const activeSpan = api.trace.getSpan(api.context.active())
        console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId })
        activeSpan.recordException(e)
        res.sendStatus(500)
      }
    })

    app.listen(process.env.USERS_PORT)

    console.log(`user services is up and running on port ${process.env.USERS_PORT}`)
  })
})
