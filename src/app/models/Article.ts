import { Schema, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import { ITEM_STATUS } from '@/config/global/const'
import { TSuspendableDocument, withSoftDeletePlugin } from '@/utils/mongoose'

export interface IArticle extends Document {
  name: string
  desc: string
  img: string
  slug: string
  status: ITEM_STATUS
  tags?: ObjectId[]
  categorizedBy: ObjectId
  createdBy: ObjectId
  createdAt: Date
  // updatedBy?: ObjectId
  updatedAt?: Date
  isDeleted?: boolean
  deletedBy?: ObjectId
  deletedAt?: Date
}

const ArticleSchema = new Schema<IArticle>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'pending' },
  // tags: { type: [Schema.Types.ObjectId], ref: 'Tag', default: [] },
  categorizedBy: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

withSoftDeletePlugin(ArticleSchema, 'User')
const Article = model<IArticle, TSuspendableDocument<IArticle>>('Article', ArticleSchema)


class ArticleModel extends SuspendableModel<IArticle> {

  constructor () {
    super(Article)
  }
  
}

export default ArticleModel