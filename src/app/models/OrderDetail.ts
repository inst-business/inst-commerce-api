import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { handleQuery } from '@/utils/mongoose'
import { GV, APPROVAL_STATUS } from '@/config/global/const'

export interface IOrderDetail {
  _id: ObjectId
  items: {
    product: ObjectId
    sku: string
    price: number
    discount?: number
    promotions?: ObjectId[]
    qty: number
  }[]
  status: APPROVAL_STATUS
  reason?: string
  order: ObjectId
  delivery: ObjectId
  seller: ObjectId
  verifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TOrderDetailDocument = IOrderDetail & Document

const OrderDetailSchema = new Schema<IOrderDetail>({
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      sku: { type: String, required: true },
      qty: { type: Number, required: true, min: 0, default: 0 },
      price: { type: Schema.Types.Decimal128, required: true },
      discount: { type: Number },
      promotions: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }],
    }],
    required: true,
    validate: {
      validator: (v: IOrderDetail['items']) => Array.isArray(v) && v.length > 0,
      message: 'Order detail requires at least 1 item.'
    }
  },
  status: { type: Number, required: true, enum: APPROVAL_STATUS, default: APPROVAL_STATUS.PENDING },
  reason: { type: String },
  order: { type: Schema.Types.ObjectId, required: true, ref: 'Order' },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'Seller' },
  delivery: { type: Schema.Types.ObjectId, required: true, ref: 'Delivery' },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true })

const OrderDetailModel = model<IOrderDetail>('OrderDetail', OrderDetailSchema)


class OrderDetail extends IndelibleModel<IOrderDetail> {

  constructor () {
    super(OrderDetailModel)
  }

}

export default OrderDetail