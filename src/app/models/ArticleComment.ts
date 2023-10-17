import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ISoftDeleted, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { FLAG, FLAG_ARR } from '@/config/global/const'

export interface IArticleComment extends ISoftDeleted {
  _id: ObjectId
  comment: string
  media?: string[]
  meta: {
    likes: number
  }
  user: ObjectId
  article: ObjectId
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
      likes: { type: Number, required: true, default: 0 },
    },
    required: true
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  article: { type: Schema.Types.ObjectId, required: true, ref: 'Article' },
  flag: {
    type: { type: String, required: true, enum: FLAG_ARR.ITEM },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    flaggedAt: { type: Date },
  },
  left: { type: Number, required: true },
  right: { type: Number, required: true },
}, { timestamps: true })

withSoftDelete(ArticleCommentSchema, 'User')
const ArticleCommentModel = model<IArticleComment, TSuspendableDocument<IArticleComment>>('ArticleComment', ArticleCommentSchema)


class ArticleComment extends SuspendableModel<IArticleComment> {

  constructor () {
    super(ArticleCommentModel)
  }
  
}

export default ArticleComment