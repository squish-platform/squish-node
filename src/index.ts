import { FetchResult } from "apollo-link"
import { ApolloClient } from "apollo-client"

import SwishPayments, { PaymentRequest, RefundRequest } from "swish-payments"

import { InvoiceInputType, InvoiceType, Options } from "./types"
import {
  CreateInvoiceMutation,
  PayInvoiceMutation,
  InvoiceSubscription,
  SimulatePaymentMutation
} from "./queries"

import { createClient } from "./createClient"

export default class Squish {
  swish: any
  paymentHook: Function
  refundHook: Function
  client: ApolloClient<any>

  constructor(private opts: Options) {
    this.swish = new SwishPayments(opts.swish.cert)
    this.paymentHook = this.swish.createHook(this.pay.bind(this))
    this.refundHook = this.swish.createHook(this.refund.bind(this))
    this.client = createClient({ token: opts.token, uri: opts.apiUrl })
  }
  /**
   * Create a new invoice
   *
   * @param  {InvoiceInputType} invoice
   * @returns Promise
   */
  create(invoice: InvoiceInputType): Promise<InvoiceType> {
    return this.client
      .mutate({
        mutation: CreateInvoiceMutation,
        variables: { data: invoice }
      })
      .then(handleResponse)
  }
  /**
   * Subscribe to invoice changes
   *
   * @param  {string} id
   * @param  {(err?:Error,invoice?:InvoiceType)=>void} callback
   */
  subscribe(id: string, callback: (err?: Error, invoice?: InvoiceType) => void) {
    return this.client
      .subscribe({ query: InvoiceSubscription, variables: { id } })
      .subscribe(res => callback(null, handleResponse(res)), callback)
  }
  /**
   * Pay invoice
   *
   * @param  {PaymentRequest} invoice
   * @returns Promise
   */
  pay(invoice: PaymentRequest): Promise<InvoiceType> {
    return this.client
      .mutate({ mutation: PayInvoiceMutation, variables: { data: invoice } })
      .then(handleResponse)
  }
  /**
   * Refund invoice
   *
   * @param  {PaymentRequestType} invoice
   * @returns Promise
   */
  refund(invoice: RefundRequest): Promise<InvoiceType> {
    console.log("refund for invoice", invoice)
    throw new Error("not implemented")
  }

  /**
   * Simulate payment
   *
   * @param  {InvoiceInputType} data
   * @returns Promise
   */
  simulate(data: InvoiceInputType): Promise<InvoiceType> {
    return this.client
      .mutate({
        mutation: SimulatePaymentMutation,
        variables: { data }
      })
      .then(handleResponse)
  }
  /**
   * Request payment token to be consumed by client to initiate Swish payment
   *
   * @param  {InvoiceInputType} invoice
   */
  paymentRequest(invoice: InvoiceInputType): Promise<string> {
    console.log("paymentRequest", invoice, this.opts)

    return this.swish.paymentRequest({
      // payeePaymentReference: invoice.id,
      callbackUrl: this.opts.swish.paymentUrl,
      payerAlias: invoice.customer,
      payeeAlias: this.opts.swish.vendor,
      amount: invoice.amount,
      currency: "SEK",
      message: invoice.id
    })
  }
}

function handleResponse(res: FetchResult) {
  console.log("handleRes", res)

  const key = Object.keys(res.data || {})[0]
  return res.data && res.data[key]
}
