import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import { STATUS, STATUS_ARR, TYPE, TYPE_ARR } from '@/config/global/const'
import { TSuspendableDocument, handleQuery, IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete } from '@/utils/mongoose'

export interface IEvent extends IEditedDetails, ISoftDeleted {
  _id: ObjectId
  name: string
  createdAt: Date
  updatedAt: Date
}

type TEventDocument = IEvent & Document

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true, minlength: 1, maxlength: 64 },
}, { timestamps: true })

withEditedDetails(EventSchema, 'UserAdmin')
withSoftDelete(EventSchema, 'UserAdmin')

const EventModel = model<IEvent, TSuspendableDocument<IEvent>>('Event', EventSchema)


class Event extends SuspendableModel<IEvent> {

  constructor () {
    super(EventModel)
  }

}

export default Event