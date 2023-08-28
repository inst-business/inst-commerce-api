import { Schema, model } from 'mongoose'
import { ITEM_STATUS } from '@/config/global/const'
import { ISoftDeleteQueryHelpers, TSoftDeleteQueryHelpers, withSoftDeletePlugin } from '@/utils/mongoose'

export interface IArticle {
  name: string,
  desc: string,
  img: string,
  slug: string,
  status: ITEM_STATUS,
  createdAt?: Date,
  updatedAt?: Date,
}

const ArticleSchema = new Schema<IArticle>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'hidden' },
}, { timestamps: true })

withSoftDeletePlugin(ArticleSchema)

const Article = model<IArticle, TSoftDeleteQueryHelpers<IArticle>>('Article', ArticleSchema)

export default Article