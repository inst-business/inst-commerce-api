import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ISoftDeleted, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { FLAG_ARR, FLAG, TYPE, TYPE_ARR } from '@/config/global/const'

export interface IProductComment extends ISoftDeleted {
  _id: ObjectId
  left: number
  right: number
  comment: string
  media?: string[]
  interaction: {
    likes: number
  }
  product: ObjectId
  entity: {
    type: TYPE['ACCOUNT']
    user: ObjectId
  }
  flag?: {
    type: FLAG['ACCOUNT']
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  editedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TProductCommentDocument = IProductComment & Document

const ProductCommentSchema = new Schema<IProductComment>({
  left: { type: Number, required: true },
  right: { type: Number, required: true },
  comment: { type: String, required: true },
  media: { type: [String] },
  interaction: {
    type: {
      likes: { type: Number, required: true, default: 0 },
    },
    required: true
  },
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  entity: {
    type: {
      type: { type: String, required: true, enum: TYPE_ARR.ACCOUNT },
      user: { type: Schema.Types.ObjectId, required: true }
    },
    required: true
  },
  flag: {
    type: { type: String, required: true, enum: FLAG_ARR.ACCOUNT },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
    flaggedAt: { type: Date },
  },
}, { timestamps: true })

withSoftDelete(ProductCommentSchema)
const ProductComment = model<IProductComment, TSuspendableDocument<IProductComment>>('ProductComment', ProductCommentSchema)


class ProductCommentModel extends SuspendableModel<IProductComment> {

  constructor () {
    super(ProductComment)
  }
  
}

export default ProductCommentModel