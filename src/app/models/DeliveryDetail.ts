import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { handleQuery } from '@/utils/mongoose'
import { GV } from '@/config/global/const'

export interface IDeliveryDetail {
  _id: ObjectId
  process?: {
    place: string
    desc?: string
    arrivedAt: Date
  }[]
  delivery: ObjectId
  createdAt: Date
  updatedAt: Date
}

type TDeliveryDetailDocument = IDeliveryDetail & Document

const DeliveryDetailSchema = new Schema<IDeliveryDetail>({
  process: [{
    place: { type: String, required: true },
    desc: { type: String },
    arrivedAt: { type: Date, required: true },
  }],
  delivery: { type: Schema.Types.ObjectId, required: true, ref: 'Delivery' },
}, { timestamps: true })

const DeliveryDetailModel = model<IDeliveryDetail>('DeliveryDetail', DeliveryDetailSchema)

class DeliveryDetail extends IndelibleModel<IDeliveryDetail> {

  constructor () {
    super(DeliveryDetailModel)
  }

}

export default DeliveryDetail