import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  handleQuery, IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { GV, PRIVACY_TYPE, ITEM_STATUS, FLAG } from '@/config/global/const'

export interface IArticle extends IEditedDetails, ISoftDeleted {
  _id: ObjectId
  name: string
  desc?: string
  content: string
  img: string
  slug: string
  interaction: {
    views: number
    likes: number
    comments: number
  }
  privacy: PRIVACY_TYPE
  status: ITEM_STATUS
  author: ObjectId
  seller: ObjectId
  category?: ObjectId
  tags?: ObjectId[]
  flag?: {
    tier: FLAG
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

type TArticleDocument = IArticle & Document

const ArticleSchema = new Schema<IArticle>({
  name: { type: String, required: true, minlength: 1, maxlength: 192 },
  desc: { type: String },
  content: { type: String, required: true },
  img: { type: String, required: true },
  slug: { type: String, required: true, unique: true, maxlength: 208 },
  interaction: {
    type: {
      views: { type: Number, required: true, min: 0, default: 0 },
      likes: { type: Number, required: true, min: 0, default: 0 },
      comments: { type: Number, required: true, min: 0, default: 0 },
    },
    required: true
  },
  privacy: { type: Number, required: true, enum: PRIVACY_TYPE, default: PRIVACY_TYPE.PUBLIC },
  status: { type: Number, required: true, enum: ITEM_STATUS, default: ITEM_STATUS.PENDING },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  flag: {
    tier: { type: Number, required: true, enum: FLAG },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
    flaggedAt: { type: Date },
  },
}, { timestamps: true })

withEditedDetails(ArticleSchema, 'UserSeller')
withSoftDelete(ArticleSchema, 'UserSeller')

const Article = model<IArticle, TSuspendableDocument<IArticle>>('Article', ArticleSchema)


class ArticleModel extends SuspendableModel<IArticle> {

  constructor () {
    super(Article)
  }
  
}

export default ArticleModel