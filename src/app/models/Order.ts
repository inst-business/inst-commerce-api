import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { STATUS, STATUS_ARR } from '@/config/global/const'
import { handleQuery } from '@/utils/mongoose'

export interface IOrder {
  _id: ObjectId
  cart: ObjectId
  code: string
  payment: number
  status: STATUS['ORDER']
  userCreated: ObjectId
  createdAt: Date
}

type TOrderDocument = IOrder & Document

const OrderSchema = new Schema<IOrder>({
  code: { type: String, required: true },
  payment: { type: Number, required: true },
  status: { type: String, required: true, enum: STATUS_ARR.ORDER, default: 'pending' },
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