"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const INVOICE = `
id
customer
vendor
status
amount_due
currency
created_at
expires_at
paid_at
meta
payment {
  amount
  payerAlias
  dateCreated
  datePaid
  status
  simulated
}
`;
exports.CreateInvoiceMutation = graphql_tag_1.default `
  mutation createInvoice($data: InvoiceInput!) {
    createInvoice(data: $data) {
      ${INVOICE}
    }
  }
`;
exports.PayInvoiceMutation = graphql_tag_1.default `
  mutation payInvoice($data: PaymentInput!) {
    payInvoice(data: $data) {
      ${INVOICE}
    }
  }
`;
exports.InvoiceQuery = graphql_tag_1.default `
  query invoice($id: ID!) {
    invoice(id: $id) {
      ${INVOICE}
    }
  }
`;
exports.InvoiceSubscription = graphql_tag_1.default `
  subscription invoice($id: ID!) {
    invoice(id: $id) {
      ${INVOICE}
    }
  }
`;
exports.SimulatePaymentMutation = graphql_tag_1.default `
  mutation simulate($data: InvoiceInput!) {
    simulate(data: $data) {
      ${INVOICE}
    }
  }
`;
//# sourceMappingURL=queries.js.map