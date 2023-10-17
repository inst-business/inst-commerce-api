import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { STATUS, STATUS_ARR, TYPE, TYPE_ARR } from '@/config/global/const'
import { handleQuery } from '@/utils/mongoose'

export interface IOrderDetail {
  _id: ObjectId
  code: string
  payment: TYPE['PAYMENT']
  status: STATUS['ORDER']
  detail: ObjectId
  user: ObjectId
  createdAt: Date
}

type TOrderDocument = IOrderDetail & Document

const OrderSchema = new Schema<IOrderDetail>({
  code: { type: String, required: true, unique: true },
  payment: { type: String, required: true, enum: TYPE_ARR.PAYMENT },
  status: { type: String, required: true, enum: STATUS_ARR.ORDER, default: 'pending' },
  detail: { type: Schema.Types.ObjectId, required: true, ref: 'OrderDetail' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true })

const OrderModel = model<IOrderDetail>('Order', OrderSchema)

class Order extends IndelibleModel<IOrderDetail> {

  constructor () {
    super(OrderModel)
  }

}

export default Order