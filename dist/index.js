"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swish_payments_1 = require("swish-payments");
const queries_1 = require("./queries");
const createClient_1 = require("./createClient");
class Squish {
    constructor(opts) {
        this.opts = opts;
        this.swish = new swish_payments_1.default(opts.swish.cert);
        this.paymentHook = this.swish.createHook(this.pay.bind(this));
        this.refundHook = this.swish.createHook(this.refund.bind(this));
        this.client = createClient_1.createClient({ token: opts.token, uri: opts.apiUrl });
    }
    /**
     * Create a new invoice
     *
     * @param  {InvoiceInputType} invoice
     * @returns Promise
     */
    create(invoice) {
        return this.client
            .mutate({
            mutation: queries_1.CreateInvoiceMutation,
            variables: { data: invoice }
        })
            .then(handleResponse);
    }
    /**
     * Subscribe to invoice changes
     *
     * @param  {string} id
     * @param  {(err?:Error,invoice?:InvoiceType)=>void} callback
     */
    subscribe(id, callback) {
        return this.client
            .subscribe({ query: queries_1.InvoiceSubscription, variables: { id } })
            .subscribe(res => callback(null, handleResponse(res)), callback);
    }
    /**
     * Pay invoice
     *
     * @param  {PaymentRequest} invoice
     * @returns Promise
     */
    pay(invoice) {
        return this.client
            .mutate({ mutation: queries_1.PayInvoiceMutation, variables: { data: invoice } })
            .then(handleResponse);
    }
    /**
     * Refund invoice
     *
     * @param  {PaymentRequestType} invoice
     * @returns Promise
     */
    refund(invoice) {
        console.log("refund for invoice", invoice);
        throw new Error("not implemented");
    }
    /**
     * Simulate payment
     *
     * @param  {InvoiceInputType} data
     * @returns Promise
     */
    simulate(data) {
        return this.client
            .mutate({
            mutation: queries_1.SimulatePaymentMutation,
            variables: { data }
        })
            .then(handleResponse);
    }
    /**
     * Request payment token to be consumed by client to initiate Swish payment
     *
     * @param  {InvoiceInputType} invoice
     */
    paymentRequest(invoice) {
        console.log("paymentRequest", invoice, this.opts);
        return this.swish.paymentRequest({
            // payeePaymentReference: invoice.id,
            callbackUrl: this.opts.swish.paymentUrl,
            payerAlias: invoice.customer,
            payeeAlias: this.opts.swish.vendor,
            amount: invoice.amount,
            currency: "SEK",
            message: invoice.id
        });
    }
}
exports.default = Squish;
function handleResponse(res) {
    console.log("handleRes", res);
    const key = Object.keys(res.data || {})[0];
    return res.data && res.data[key];
}
//# sourceMappingURL=index.js.map