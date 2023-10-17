import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, TSuspendableDocument
} from '@/utils/mongoose'
import { STATUS, STATUS_ARR } from '@/config/global/const'

export interface ICart {
  _id: ObjectId
  items: {
    product: ObjectId,
    sku: string,
    qty: number
  }[]
  user: ObjectId
  createdAt: Date
  updatedAt: Date
}

type TCartDocument = ICart & Document

const CartSchema = new Schema<ICart>({
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      sku: { type: String, required: true },
      qty: { type: Number, required: true, min: 0, default: 0 },
    }],
    required: true
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true })

const CartModel = model<ICart>('Cart', CartSchema)


class Cart extends IndelibleModel<ICart> {

  constructor () {
    super(CartModel)
  }
  
}

export default Cart