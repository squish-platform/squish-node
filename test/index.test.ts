import Squish from "../src/"

describe("squish-node", () => {
  const newInvoice = { amount: "100.00", customer: "foo" }
  const squish = new Squish({
    token: "token",
    swish: {
      vendor: "foo",
      callbackUrl: "http://localhost:4000",
      cert: {
        pfx: "path",
        passphrase: "swish"
      }
    }
  })

  it("Squish is instantiable", () => {
    expect(squish).toBeInstanceOf(Squish)
  })
  it("creates invoices", async () => {
    const invoice = await squish.create(newInvoice)

    expect(invoice.id).toBeDefined()
    expect(invoice.amount_due).toEqual(newInvoice.amount)
    expect(invoice.customer).toEqual(newInvoice.customer)
  })
  it("subscribes to invoice changes", async done => {
    const invoice = await squish.create(newInvoice)

    squish.subscribe(invoice.id, (err, inv) => {
      console.log("invoice", err, inv)

      expect(err).toEqual(null)
      expect(inv).toBeDefined()
      done()
    })

    const paid = await squish.simulate({
      id: invoice.id,
      amount: invoice.amount_due,
      customer: invoice.customer
    })

    console.log("paid", paid)

    expect(paid.status).toEqual("paid")
    expect(paid.amount_due).toEqual("0.00")
    expect(paid.payment.amount).toEqual("100.00")
  })
})
