import { Schema, Document, model, ObjectId } from 'mongoose'
import Model from './Model'
import {
  TSuspendableDocument
} from '@/utils/mongoose'
import { GV, INTERACTION_TYPE, ACCOUNT_STATUS } from '@/config/global/const'

export interface IArticleLike {
  _id: ObjectId
  entity: {
    type: INTERACTION_TYPE
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
      type: { type: Number, required: true, enum: INTERACTION_TYPE },
      object: { type: Schema.Types.ObjectId, required: true }
    },
    required: true
  },
}, { timestamps: true })

const ArticleLikeModel = model<IArticleLike, TSuspendableDocument<IArticleLike>>('ArticleLike', ArticleLikeSchema)


class ArticleLike extends Model<IArticleLike> {

  constructor () {
    super(ArticleLikeModel)
  }
  
}

export default ArticleLike