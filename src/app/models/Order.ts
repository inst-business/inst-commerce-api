import mongoose, { Model, Schema, model } from 'mongoose'
import { ORDER_STATUS } from '@/config/global/const'

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

export default Order