import { Schema, model, ObjectId } from 'mongoose'
import { IUser } from './User'
import { ICategory } from './Category'
import { ITEM_STATUS } from '@/config/global/const'
import { TSuspendableDocument, withSoftDeletePlugin } from '@/utils/mongoose'

export interface IProduct {
  name: string,
  desc: string,
  img: string,
  slug: string,
  status: ITEM_STATUS,
  authorId: ObjectId,
  categoryId: ObjectId,
  isDeleted?: boolean,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'pending' },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true })

withSoftDeletePlugin(ProductSchema)

const Product = model<IProduct, TSuspendableDocument<IProduct>>('Product', ProductSchema)

export default Product