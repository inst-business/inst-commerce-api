import { Schema, Document, model, ObjectId, Decimal128 } from 'mongoose'
import { IndelibleModel } from './Model'
import { STATUS, STATUS_ARR, TYPE, TYPE_ARR } from '@/config/global/const'
import { handleQuery, IEditedDetails, withEditedDetails } from '@/utils/mongoose'

export interface IOrder extends IEditedDetails {
  _id: ObjectId
  code: string
  fullname: string
  email: string
  tel: string
  total: number | Decimal128
  status: STATUS['APPROVAL']
  transaction: ObjectId
  user: ObjectId
  createdAt: Date
  updatedAt: Date
}

type TOrderDocument = IOrder & Document

const OrderSchema = new Schema<IOrder>({
  code: { type: String, required: true, unique: true },
  fullname: { type: String, required: true, minlength: 1, maxlength: 64 },
  email: { type: String, required: true, maxlength: 24 },
  tel: { type: String, required: true, maxlength: 24 },
  total: { type: Schema.Types.Decimal128, required: true },
  status: { type: String, required: true, enum: STATUS_ARR.APPROVAL, default: 'pending' },
  transaction: { type: Schema.Types.ObjectId, required: true, ref: 'Transaction' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true })

withEditedDetails(OrderSchema)

const OrderModel = model<IOrder>('Order', OrderSchema)

class Order extends IndelibleModel<IOrder> {

  constructor () {
    super(OrderModel)
  }
  
  async getOneByCode (code: string): Promise<IOrder | null> {
    const q = this.Model.findOne({ code: code }).lean()
    const data = await handleQuery(q)
    return data
  }
  
}

export default Order