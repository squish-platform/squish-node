/// <reference types="zen-observable" />
import { ApolloClient } from "apollo-client";
import { PaymentRequest, RefundRequest } from "swish-payments";
import { InvoiceInputType, InvoiceType, Options } from "./types";
export default class Squish {
    private opts;
    swish: any;
    paymentHook: Function;
    refundHook: Function;
    client: ApolloClient<any>;
    constructor(opts: Options);
    /**
     * Create a new invoice
     *
     * @param  {InvoiceInputType} invoice
     * @returns Promise
     */
    create(invoice: InvoiceInputType): Promise<InvoiceType>;
    /**
     * Subscribe to invoice changes
     *
     * @param  {string} id
     * @param  {(err?:Error,invoice?:InvoiceType)=>void} callback
     */
    subscribe(id: string, callback: (err?: Error, invoice?: InvoiceType) => void): ZenObservable.Subscription;
    /**
     * Pay invoice
     *
     * @param  {PaymentRequest} invoice
     * @returns Promise
     */
    pay(invoice: PaymentRequest): Promise<InvoiceType>;
    /**
     * Refund invoice
     *
     * @param  {PaymentRequestType} invoice
     * @returns Promise
     */
    refund(invoice: RefundRequest): Promise<InvoiceType>;
    /**
     * Simulate payment
     *
     * @param  {InvoiceInputType} data
     * @returns Promise
     */
    simulate(data: InvoiceInputType): Promise<InvoiceType>;
    /**
     * Request payment token to be consumed by client to initiate Swish payment
     *
     * @param  {InvoiceInputType} invoice
     */
    paymentRequest(invoice: InvoiceInputType): Promise<string>;
}
