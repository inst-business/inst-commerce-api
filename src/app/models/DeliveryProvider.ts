import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { STATUS, STATUS_ARR, TYPE, TYPE_ARR } from '@/config/global/const'
import { handleQuery } from '@/utils/mongoose'

export interface IDeliveryProvider {
  _id: ObjectId
  name: string
  createdAt: Date
  updatedAt: Date
}

type TDeliveryProviderDocument = IDeliveryProvider & Document

const DeliveryProviderSchema = new Schema<IDeliveryProvider>({
  name: { type: String, required: true, minlength: 1, maxlength: 64 },
}, { timestamps: true })

const DeliveryProviderModel = model<IDeliveryProvider>('DeliveryProvider', DeliveryProviderSchema)

class DeliveryProvider extends IndelibleModel<IDeliveryProvider> {

  constructor () {
    super(DeliveryProviderModel)
  }

}

export default DeliveryProvider