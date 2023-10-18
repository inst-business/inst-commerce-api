import { Schema, Document, model, ObjectId, Decimal128 } from 'mongoose'
import { IndelibleModel } from './Model'
import _ from '@/utils/utils'
import {
  handleQuery, IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { GV, STATUS, STATUS_ARR, FLAG, FLAG_ARR, TYPE } from '@/config/global/const'

export interface IDelivery extends IEditedDetails {
  _id: ObjectId
  code: string
  fullname: string
  email: string
  tel: string
  address: string
  country: string
  note: string
  sellerNote: string
  type: TYPE['DELIVERY']
  fee: number | Decimal128
  taxes?: number | Decimal128
  deliveredDate: Date
  estimatedReceiveDate: Date
  receivedDate?: Date
  // status: STATUS['APPROVAL']
  status: STATUS['PROCESS']
  transaction: ObjectId
  provider?: ObjectId
  // approvedBy?: ObjectId
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TDeliveryDocument = IDelivery & Document

const DeliverySchema = new Schema<IDelivery>({
  code: { type: String, required: true, unique: true },
  fullname: { type: String, required: true, minlength: 1, maxlength: 64 },
  email: { type: String, required: true, maxlength: 24 },
  tel: { type: String, required: true, maxlength: 24 },
  fee: { type: Schema.Types.Decimal128, required: true },
  taxes: { type: Schema.Types.Decimal128 },
  deliveredDate: { type: Date, required: true },
  estimatedReceiveDate: { type: Date, required: true },
  receivedDate: { type: Date },
  // status: { type: String, required: true, enum: STATUS_ARR.APPROVAL, default: 'pending' },
  status: { type: String, required: true, enum: STATUS_ARR.PROCESS, default: 'processing' },
  transaction: { type: Schema.Types.ObjectId, required: true, ref: 'Transaction' },
  provider: { type: Schema.Types.ObjectId, ref: 'DeliveryProvider' },
  // approvedBy: { type: Schema.Types.ObjectId, ref: 'UserSeller' },
  approvedAt: { type: Date },
})

withEditedDetails(DeliverySchema)
const DeliveryModel = model<IDelivery>('Delivery', DeliverySchema)

class Delivery extends IndelibleModel<IDelivery> {

  constructor () {
    super(DeliveryModel)
  }
  
  async getOneByCode (code: string): Promise<IDelivery | null> {
    const q = this.Model.findOne({ code: code }).lean()
    const data = await handleQuery(q)
    return data
  }
  
}

export default Delivery