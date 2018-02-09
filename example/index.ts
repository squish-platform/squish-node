import Squish, { InvoiceType } from "./src/squish-node"

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
squish.create({ amount: "100.00", customer: "46700123456" }).then((invoice: any) => {
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

  /*
    Create payment request token
  */
  squish
    .paymentRequest(invoice)
    .then((token: any) => console.log("payment request token to be sent to client :", token))

  /*
  Subscribe to invoice changes
  */
  squish.subscribe(
    invoice.id,
    (update: any) => console.log("payment update for invoice: ", update),
    console.error
  )

  /*
  Simulate payment
  */
  squish
    .simulate({
      id: invoice.id,
      amount: invoice.amount_due,
      customer: "46700123457"
    })
    .then((paid: any) => {
      console.log("simulated payment: ", paid)
    })
})
