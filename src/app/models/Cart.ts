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
  products: {
    productId: ObjectId,
    qty: number
  }[]
  createdAt: Date
  updatedAt: Date
}

type TCartDocument = ICart & Document

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  products: {
    type: [{
      productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      qty: { type: Number, required: true },
    }],
    required: true
  }
}, { timestamps: true })

withSoftDelete(CartSchema, 'User')
const CartModel = model<ICart, TSuspendableDocument<ICart>>('Cart', CartSchema)


class Cart extends SuspendableModel<ICart> {

  constructor () {
    super(CartModel)
  }
  
}

export default Cart