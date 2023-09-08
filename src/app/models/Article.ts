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
  authorId: ObjectId
  categoryId: ObjectId
  productId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const ArticleSchema = new Schema<IArticle>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'pending' },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
}, { timestamps: true })

withSoftDeletePlugin(ArticleSchema)
const Article = model<IArticle, TSuspendableDocument<IArticle>>('Article', ArticleSchema)


class ArticleModel extends SuspendableModel<IArticle> {

  constructor () {
    super(Article)
  }
  
}

export default ArticleModel