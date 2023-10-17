import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { STATUS, STATUS_ARR, TYPE, TYPE_ARR } from '@/config/global/const'
import { handleQuery } from '@/utils/mongoose'

export interface IOrder {
  _id: ObjectId
  code: string
  payment: TYPE['PAYMENT']
  items: {
    product: ObjectId,
    sku: string,
    qty: number
  }[]
  status: STATUS['ORDER']
  // detail: ObjectId
  user: ObjectId
  createdAt: Date
}

type TOrderDocument = IOrder & Document

const OrderSchema = new Schema<IOrder>({
  code: { type: String, required: true, unique: true },
  payment: { type: String, required: true, enum: TYPE_ARR.PAYMENT },
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      sku: { type: String, required: true },
      qty: { type: Number, required: true, min: 0, default: 0 },
    }],
    required: true
  },
  status: { type: String, required: true, enum: STATUS_ARR.ORDER, default: 'pending' },
  // detail: { type: Schema.Types.ObjectId, required: true, ref: 'OrderDetail' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true })

const OrderModel = model<IOrder>('Order', OrderSchema)

class Order extends IndelibleModel<IOrder> {

  constructor () {
    super(OrderModel)
  }
  
  async getOneByCode (code: string): Promise<IOrder | null> {
    const q = OrderModel.findOne({ code: code }).lean()
    const data = await handleQuery(q)
    return data
  }
  
}

export default Order