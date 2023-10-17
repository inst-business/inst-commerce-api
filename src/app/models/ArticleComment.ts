import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ISoftDeleted, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { FLAG, FLAG_ARR, TYPE, TYPE_ARR } from '@/config/global/const'

export interface IArticleComment extends ISoftDeleted {
  _id: ObjectId
  comment: string
  media?: string[]
  meta: {
    likes: number
  }
  article: ObjectId
  entity: {
    type: TYPE['ACCOUNT']
    user: ObjectId
  }
  flag?: {
    type: FLAG['ITEM']
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  left: number
  right: number
  editedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TArticleCommentDocument = IArticleComment & Document

const ArticleCommentSchema = new Schema<IArticleComment>({
  comment: { type: String, required: true },
  media: { type: [String] },
  meta: {
    type: {
      likes: { type: Number, required: true, min: 0, default: 0 },
    },
    required: true
  },
  article: { type: Schema.Types.ObjectId, required: true, ref: 'Article' },
  entity: {
    type: {
      type: { type: String, required: true, enum: TYPE_ARR.ACCOUNT },
      user: { type: Schema.Types.ObjectId, required: true }
    },
    required: true
  },
  flag: {
    type: { type: String, required: true, enum: FLAG_ARR.ITEM },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
    flaggedAt: { type: Date },
  },
  left: { type: Number, required: true, default: 1 },
  right: { type: Number, required: true, default: 2 },
}, { timestamps: true })

withSoftDelete(ArticleCommentSchema, 'User')
const ArticleCommentModel = model<IArticleComment, TSuspendableDocument<IArticleComment>>('ArticleComment', ArticleCommentSchema)


class ArticleComment extends SuspendableModel<IArticleComment> {

  constructor () {
    super(ArticleCommentModel)
  }
  
}

export default ArticleComment