export type InvoiceInputType = {
  id?: string
  amount: string
  customer: string
}

export type InvoiceType = {
  id: string
  amount: string
  customer: string
  vendor: string
  status: string
  amount_due: string
  currency: string
  created_at: string
  expires_at: string
  paid_at: string
  meta: string
  payment: any
}

export type Options = {
  token: string
  apiUrl: string
  swish: {
    vendor: string
    paymentUrl: string
    refundUrl: string
    cert: {
      pfx: string
      passphrase: string
    }
  }
}
