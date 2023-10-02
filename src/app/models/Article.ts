import { Schema, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { ITEM_STATUS } from '@/config/global/const'

export interface IArticle {
  _id: ObjectId
  name: string
  desc: string
  img: string
  slug: string
  status: ITEM_STATUS
  tags?: ObjectId[]
  categorizedBy?: ObjectId
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
  editedBy?: ObjectId
  editedAt?: Date
  isDeleted: boolean
  deletedBy?: ObjectId
  deletedAt?: Date
}

type TArticleDocument = IArticle & Document

const ArticleSchema = new Schema<IArticle>({
  name: { type: String, required: true, minlength: 1, maxlength: 80 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, unique: true, maxlength: 96 },
  status: { type: String, required: true, default: 'pending' },
  // tags: { type: [Schema.Types.ObjectId], ref: 'Tag', default: [] },
  categorizedBy: { type: Schema.Types.ObjectId, ref: 'Category' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
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