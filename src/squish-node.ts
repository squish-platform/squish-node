import { IncomingMessage } from "http"
import { Response } from "node-fetch"
import { FetchResult } from "apollo-link"
import { ErrorCallback, AsyncResultCallback } from "async"
import { ApolloClient, ApolloQueryResult } from "apollo-client"
import { ExecutionResult } from "graphql/execution/execute"
import { Observable } from "apollo-client/util/Observable"
import SwishPayments, { PaymentRequestType } from "swish-payments"
import { createClient } from "./createLink"

import { InvoiceInputType, InvoiceType, SquishOptions } from "./types"
import {
  CreateInvoiceMutation,
  PayInvoiceMutation,
  InvoiceSubscription,
  SimulatePaymentMutation
} from "./queries"

export default class Squish {
  swish: SwishPayments
  paymentHook: Function
  client: ApolloClient<any>

  constructor(private opts: SquishOptions) {
    this.swish = new SwishPayments(opts.swish.cert)
    this.paymentHook = this.swish.createHook(this.pay)

    this.client = createClient({ token: opts.token, uri: "http://localhost:4000" })
  }
  /**
   * Create a new invoice
   *
   * @param  {InvoiceInputType} data
   * @returns Promise
   */
  create(data: InvoiceInputType): Promise<InvoiceType> {
    return this.client
      .mutate({
        mutation: CreateInvoiceMutation,
        variables: { data }
      })
      .then(handleResponse)
  }
  /**
   * Subscribe to changes to an invoice
   *
   * @param  {string} id
   * @param  {AsyncResultCallback<InvoiceType>} onUpdate
   * @param  {ErrorCallback<Error>} onError
   */
  subscribe(id: string, onUpdate: AsyncResultCallback<InvoiceType>, onError: ErrorCallback<Error>) {
    return this.client
      .subscribe({ query: InvoiceSubscription, variables: { id } })
      .subscribe(res => onUpdate(handleResponse(res)), onError)
  }
  /**
   * Pay invoice
   *
   * @param  {PaymentRequestType} data
   * @returns Promise
   */
  pay(data: PaymentRequestType): Promise<InvoiceType> {
    return this.client
      .mutate({ mutation: PayInvoiceMutation, variables: { data } })
      .then(handleResponse)
  }
  /**
   * Refund invoice
   *
   * @param  {PaymentRequestType} data
   * @returns Promise
   */
  refund(data: PaymentRequestType): Promise<InvoiceType> {
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
    return this.swish.paymentRequest({
      payeePaymentReference: invoice.id,
      callbackUrl: this.opts.swish.callbackUrl,
      payerAlias: invoice.customer,
      payeeAlias: this.opts.swish.vendor,
      amount: invoice.amount,
      currency: "SEK",
      message: invoice.id
    })
  }
}

function handleResponse(res: FetchResult) {
  const key = Object.keys(res.data || {})[0]
  return res.data && res.data[key]
}
