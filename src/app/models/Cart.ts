import { Schema, Document, model, ObjectId } from 'mongoose'
import Model from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, TSuspendableDocument
} from '@/utils/mongoose'
import { GV } from '@/config/global/const'

export interface ICart {
  _id: ObjectId
  items: {
    product: ObjectId
    sku: string
    qty: number
    addedAt: Date
  }[]
  user: ObjectId
}

type TCartDocument = ICart & Document

const CartSchema = new Schema<ICart>({
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      sku: { type: String, required: true },
      qty: { type: Number, required: true, min: 0, default: 0 },
      addedAt: { type: Date, required: true, default: new Date() }
    }],
    required: true
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

const CartModel = model<ICart>('Cart', CartSchema)


class Cart extends Model<ICart> {

  constructor () {
    super(CartModel)
  }
  
}

export default Cart