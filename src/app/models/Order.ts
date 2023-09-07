import { Schema, model } from 'mongoose'
import { IndelibleModel } from './Model'
import { ORDER_STATUS } from '@/config/global/const'
import { handleQuery } from '@/utils/mongoose'

export interface IOrder {
  code: string,
  amount: string,
  payment: number,
  status: ORDER_STATUS,
  createdAt: Date
}

const OrderSchema = new Schema<IOrder>({
  code: { type: String, required: true },
  amount: { type: String, required: true },
  payment: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
}, { timestamps: true })

const Order = model<IOrder>('Order', OrderSchema)

class OrderModel extends IndelibleModel<IOrder> {

  constructor () {
    super(Order)
  }
  
  async getOneByCode (code: String): Promise<IOrder | null> {
    const q = Order.findOne({ code: code }).lean()
    const data = await handleQuery(q)
    return data
  }
  
}

export default OrderModel