const Title = (props) => <p>{props.label}</p>
const Response = (props) => <pre>{JSON.stringify(props.result, null, 4)}</pre>
const ProductDD = (props) => {
  return (
    <select onChange={props.handleProductChange}>
      <option selected>Choose product</option>
      <option value={'999'}>MacBook Air</option>
      <option value={'1100'}>MacBook Pro</option>
      <option value={'599'}>Mac Mini</option>
    </select>
  )
}
const App = () => {
  let [user, setUser] = React.useState()
  let [payment, setPayment] = React.useState()
  let [order, setOrder] = React.useState()
  let [product, setProduct] = React.useState()
  let createUser = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          USER_NAME: 'Abishek',
          ACCOUNT: 'ABCDE1234F',
        }),
      }
      let response = await fetch('http://localhost:8081/user/create', requestOptions)
      let result = await response.json()
      setUser(result)
      console.log(result)
    } catch (error) {
      setUser(error.message)
      console.log('err', error.message)
    }
  }

  let handleProduct = (e) => {
    let { options, value } = e.target
    setProduct({
      PRODUCT_NAME: options[options.selectedIndex].text,
      PRICE: String(value),
    })
  }
  let transferFund = async () => {
    console.log('transferFund', user)
    const requestOptions = {
      method: 'GET',
    }
    let response = await fetch(
      `http://localhost:8080/payment/transfer/id/${user.ID}?amount=10000`,
      requestOptions
    )
    let result = await response.json()
    setPayment(result)
    console.log(result)
  }

  let placeOrder = async () => {
    console.log('placeOrder', product)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        USER_ID: user.ID,
        PRODUCT_NAME: product.PRODUCT_NAME,
        PRICE: product.PRICE,
      }),
    }
    let response = await fetch('http://localhost:8082/order/create', requestOptions)
    let result = await response.json()
    setOrder(result)
    console.log(result)
  }
  let handleReset = () => {
    setUser()
    setPayment()
    setOrder()
    setProduct()
  }
  let openSignoz = () => window.open('http://localhost:3301/application')
  return (
    <div>
      <button onClick={handleReset}>Reset Actions</button>
      <button onClick={openSignoz} style={{ marginLeft: 10 }}>
        Open Signoz
      </button>
      <Title label="1.User Creation"></Title>
      <button onClick={createUser}>Create User</button>
      <Response result={user} />
      {user && (
        <div>
          <Title label="2.Transfer amount"></Title>
          <button onClick={transferFund}>Transfer Fund</button>
          <Response result={payment} />
        </div>
      )}
      {payment && (
        <div>
          <Title label="3.Place order"></Title>
          <ProductDD handleProductChange={handleProduct} />
          {product && <button onClick={placeOrder}>Place Order</button>}
          {order && (
            <div>
              <Response result={order} />
              <h3>Order Placed!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
