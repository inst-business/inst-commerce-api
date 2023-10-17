import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, IEditedDetails, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { } from '@/config/global/const'

export interface IInventory extends IEditedDetails {
  _id: ObjectId
  sku: string
  qty: number
  product: ObjectId
  reservations?: {
    user: ObjectId,
    qty: number
  }[]
  createdAt: Date
  updatedAt: Date
}

type TInventoryDocument = IInventory & Document

const InventorySchema = new Schema<IInventory>({
  sku: { type: String, required: true, unique: true },
  qty: { type: Number, required: true, min: 0, default: 0 },
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  reservations: [{
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    qty: { type: Number, required: true, min: 0 },
  }],
}, { timestamps: true })

withEditedDetails(InventorySchema, 'UserSeller')
withSoftDelete(InventorySchema, 'User')

const InventoryModel = model<IInventory, TSuspendableDocument<IInventory>>('Inventory', InventorySchema)


class Inventory extends SuspendableModel<IInventory> {

  constructor () {
    super(InventoryModel)
  }
  
}

export default Inventory