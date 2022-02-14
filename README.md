# opentelemetry-nodejs-distributed-tracing

This project demonstrates how to implement distributed tracing in node js with the help for below microservices
### Tracing flow
![Distributed tracing](service-flow.png)

### Running the code

Install all the dependencies by runing `npm install`

Spin up the services

- `npm run users`
- `npm run payment`
- `npm run orders`

API calls

- localhost:8081/user/create (POST)
- localhost:8080/payment/transfer/id/5?amount=500 (GET)
- localhost:8082/order/create (POST)

View traces, logs and metrics:

- View the metrics in signoz, go to http://localhost:3301/application 
