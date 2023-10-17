import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { FLAG_ARR, FLAG } from '@/config/global/const'

export interface IProductComment extends IEditedDetails, ISoftDeleted {
  _id: ObjectId
  comment: string
  media?: string[]
  meta: {
    likes: number
  }
  user: ObjectId
  product: ObjectId
  left: number
  right: number
  flag?: {
    type: FLAG['ACCOUNT']
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

type TProductCommentDocument = IProductComment & Document

const ProductCommentSchema = new Schema<IProductComment>({
  comment: { type: String, required: true },
  media: { type: [String] },
  meta: {
    type: {
      likes: { type: Number, required: true, default: 0 },
    },
    required: true
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  flag: {
    type: { type: String, required: true, enum: FLAG_ARR.ACCOUNT },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    flaggedAt: { type: Date },
  },
  left: { type: Number, required: true },
  right: { type: Number, required: true },
}, { timestamps: true })

withEditedDetails(ProductCommentSchema, 'User')
withSoftDelete(ProductCommentSchema, 'User')
const ProductComment = model<IProductComment, TSuspendableDocument<IProductComment>>('ProductComment', ProductCommentSchema)


class ProductCommentModel extends SuspendableModel<IProductComment> {

  constructor () {
    super(ProductComment)
  }
  
}

export default ProductCommentModel