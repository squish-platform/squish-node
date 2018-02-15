import gql from "graphql-tag"

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
  payeeAlias
  payerAlias
  dateCreated
  datePaid
  status
  simulated
}
`

export const CreateInvoiceMutation = gql`
  mutation createInvoice($data: InvoiceInput!) {
    createInvoice(data: $data) {
      ${INVOICE}
    }
  }
`
export const PayInvoiceMutation = gql`
  mutation payInvoice($data: PaymentInput!) {
    payInvoice(data: $data) {
      ${INVOICE}
    }
  }
`
export const InvoiceQuery = gql`
  query invoice($id: ID!) {
    invoice(id: $id) {
      ${INVOICE}
    }
  }
`
export const InvoiceSubscription = gql`
  subscription invoice($id: ID!) {
    invoice(id: $id) {
      ${INVOICE}
    }
  }
`
export const SimulatePaymentMutation = gql`
  mutation simulate($data: InvoiceInput!) {
    simulate(data: $data) {
      ${INVOICE}
    }
  }
`
