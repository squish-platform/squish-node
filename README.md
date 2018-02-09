# Squish Node.js Library

The Squish Node library provides convenient access to Squish API from server-side applications.

## Documentation

## Installation

Install the package with:

    npm install squish --save

## Usage

The package needs to be configured with your account's secret key.

```js
import Squish from "squish"

const squish = new Squish({
  token: "<secret_key>",
  swish: {
    vendor: "1231181189",
    callbackUrl: "https://www.example.com/hooks/payments",
    cert: {
      pfx: __dirname + "/ssl/1231181189.p12",
      passphrase: "swish"
    }
  }
})


// Create new invoice
const invoice = await squish.create(
  { amount: '100.00', customer: "46700123456" }
);
```

## Example

```js
// Setup Swish payment request webook
app.post("/paymentrequests", squish.paymentHook)

// Create invoice
squish.create({ amount: "100.00", customer: "46700123456" }).then(invoice => {
  console.log("invoice created: ", invoice)
  /*
  { id: 'M.kkF6;se;4ssHN19,P:',
    customer: 'foo',
    vendor: 'vendor_id',
    status: 'unpaid',
    amount_due: '100.00',
    currency: 'SEK',
    created_at: '2018-02-09T17:44:59.355Z',
    expires_at: '2018-02-10T17:44:59.355Z',
    paid_at: null,
    meta: null,
    payment: null,
    __typename: 'Invoice' }
  */

  // Request payment token to be consumed by client to initiate Swish payment
  squish.paymentRequest(invoice).then(
    token => console.log("payment request token to be sent to client :", token)
    // 900D843722644C149995AC246E14D8C6
  )

  // Subscribe to changes to an invoice
  squish.subscribe(
    invoice.id,
    update => console.log("payment update for invoice: ", update),
    console.error
  )

  // Simulate payment
  squish
    .simulate({
      id: invoice.id,
      amount: invoice.amount_due,
      customer: "46700123457"
    })
    .then(paid => {
      console.log("simulated payment: ", paid)
    })
})
```
