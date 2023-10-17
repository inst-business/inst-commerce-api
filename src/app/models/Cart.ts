import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, ISoftDeleted, TSuspendableDocument, withSoftDelete
} from '@/utils/mongoose'
import { STATUS, STATUS_ARR } from '@/config/global/const'

export interface ICart extends ISoftDeleted {
  _id: ObjectId
  user: ObjectId
  items: {
    product: ObjectId,
    sku: string,
    qty: number
  }[]
  createdAt: Date
  updatedAt: Date
}

type TCartDocument = ICart & Document

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      sku: { type: String, required: true },
      qty: { type: Number, required: true, min: 0, default: 0 },
    }],
    required: true
  },
}, { timestamps: true })

withSoftDelete(CartSchema, 'User')
const CartModel = model<ICart, TSuspendableDocument<ICart>>('Cart', CartSchema)


class Cart extends SuspendableModel<ICart> {

  constructor () {
    super(CartModel)
  }
  
}

export default Cart