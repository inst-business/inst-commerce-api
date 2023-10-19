import { Schema, Document, model, ObjectId } from 'mongoose'
import { IndelibleModel } from './Model'
import { handleQuery } from '@/utils/mongoose'
import { GV } from '@/config/global/const'

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