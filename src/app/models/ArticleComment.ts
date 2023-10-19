import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ISoftDeleted, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { GV, ITEM_TYPE, FLAG } from '@/config/global/const'

export interface IArticleComment extends ISoftDeleted {
  _id: ObjectId
  left: number
  right: number
  comment: string
  media?: string[]
  interaction: {
    likes: number
  }
  article: ObjectId
  entity: {
    type: ITEM_TYPE
    user: ObjectId
  }
  flag?: {
    tier: FLAG
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  editedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TArticleCommentDocument = IArticleComment & Document

const ArticleCommentSchema = new Schema<IArticleComment>({
  left: { type: Number, required: true, default: 1 },
  right: { type: Number, required: true, default: 2 },
  comment: { type: String, required: true },
  media: [{ type: String }],
  interaction: {
    type: {
      likes: { type: Number, required: true, min: 0, default: 0 },
    },
    required: true
  },
  article: { type: Schema.Types.ObjectId, required: true, ref: 'Article' },
  entity: {
    type: {
      type: { type: Number, required: true, enum: ITEM_TYPE },
      user: { type: Schema.Types.ObjectId, required: true }
    },
    required: true
  },
  flag: {
    tier: { type: Number, required: true, enum: FLAG },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
    flaggedAt: { type: Date },
  },
}, { timestamps: true })

withSoftDelete(ArticleCommentSchema)

const ArticleCommentModel = model<IArticleComment, TSuspendableDocument<IArticleComment>>('ArticleComment', ArticleCommentSchema)


class ArticleComment extends SuspendableModel<IArticleComment> {

  constructor () {
    super(ArticleCommentModel)
  }
  
}

export default ArticleComment