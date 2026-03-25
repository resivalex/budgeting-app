export interface TransactionDTO {
  _id: string
  datetime: string
  account_from: string
  account_to: string
  category: string
  amount: string
  currency: string
  counterparty: string
  comment: string
  bucket_from: string
  bucket_to: string
  kind: 'transaction'
}
