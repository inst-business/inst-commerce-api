export interface IPromotion {
  _id?: number
  type: number
  code: string
  exhibitor_ids?: string
  event_id: number
  expiry?: Date
  limitation?: number
  value?: number
  status?: number
  cond_payment_term?: number
  cond_promo?: number
  cond_tiers?: string
  createdAt: Date
  updatedAt: Date
}