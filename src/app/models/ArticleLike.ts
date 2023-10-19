import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ISoftDeleted, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { INTERACTION, ACCOUNT_STATUS, FLAG, FLAG_ARR, TYPE, TYPE_ARR } from '@/config/global/const'

export interface IArticleLike extends ISoftDeleted {
  _id: ObjectId
  entity: {
    type: INTERACTION
    object: ObjectId
  }
  status: ACCOUNT_STATUS
  createdAt: Date
  updatedAt: Date
}

type TArticleLikeDocument = IArticleLike & Document

const ArticleLikeSchema = new Schema<IArticleLike>({
  status: { type: Number, required: true, enum: ACCOUNT_STATUS, default: ACCOUNT_STATUS.PENDING },
  entity: {
    type: {
      type: { type: Number, required: true, enum: INTERACTION },
      object: { type: Schema.Types.ObjectId, required: true }
    },
    required: true
  },
}, { timestamps: true })

withSoftDelete(ArticleLikeSchema)

const ArticleLikeModel = model<IArticleLike, TSuspendableDocument<IArticleLike>>('ArticleLike', ArticleLikeSchema)


class ArticleLike extends SuspendableModel<IArticleLike> {

  constructor () {
    super(ArticleLikeModel)
  }
  
}

export default ArticleLike