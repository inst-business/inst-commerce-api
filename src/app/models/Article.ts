import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  handleQuery, IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { STATUS, STATUS_ARR, FLAG, FLAG_ARR } from '@/config/global/const'

export interface IArticle extends IEditedDetails, ISoftDeleted {
  _id: ObjectId
  name: string
  desc?: string
  content: string
  img: string
  slug: string
  meta: {
    views: number
    likes: number
    comments?: number
  }
  status: STATUS['ITEM']
  author: ObjectId
  category?: ObjectId
  tags?: ObjectId[]
  flag?: {
    type: FLAG['ITEM']
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
  meta: {
    type: {
      views: { type: Number, required: true, default: 0 },
      likes: { type: Number, required: true, default: 0 },
      comments: { type: Number, default: 0 },
    },
    required: true
  },
  status: { type: String, required: true, enum: STATUS_ARR.ITEM, default: 'pending' },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  // tags: { type: [Schema.Types.ObjectId], ref: 'Tag' },
  flag: {
    type: { type: String, required: true, enum: FLAG_ARR.ITEM },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    flaggedAt: { type: Date },
  },
}, { timestamps: true })

withEditedDetails(ArticleSchema, 'User')
withSoftDelete(ArticleSchema, 'User')
const Article = model<IArticle, TSuspendableDocument<IArticle>>('Article', ArticleSchema)


class ArticleModel extends SuspendableModel<IArticle> {

  constructor () {
    super(Article)
  }
  
}

export default ArticleModel