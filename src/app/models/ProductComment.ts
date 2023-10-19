import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ISoftDeleted, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { GV, ACCOUNT_TYPE, FLAG } from '@/config/global/const'

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
    type: ACCOUNT_TYPE
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

type TProductCommentDocument = IProductComment & Document

const ProductCommentSchema = new Schema<IProductComment>({
  left: { type: Number, required: true },
  right: { type: Number, required: true },
  comment: { type: String, required: true },
  media: [{ type: String }],
  interaction: {
    type: {
      likes: { type: Number, required: true, default: 0 },
    },
    required: true
  },
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  entity: {
    type: {
      type: { type: Number, required: true, enum: ACCOUNT_TYPE },
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

withSoftDelete(ProductCommentSchema)

const ProductCommentModel = model<IProductComment, TSuspendableDocument<IProductComment>>('ProductComment', ProductCommentSchema)


class ProductComment extends SuspendableModel<IProductComment> {

  constructor () {
    super(ProductCommentModel)
  }
  
}

export default ProductComment