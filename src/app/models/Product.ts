import mongoose, { Model, Schema, model } from 'mongoose'
import { ITEM_STATUS } from '@/config/global/const'
import { ISoftDeleteQueryHelpers, TSoftDeleteQueryHelpers, withSoftDeletePlugin } from '@/utils/mongoose'

export interface IProduct {
  name: string,
  desc: string,
  img: string,
  slug: string,
  status: ITEM_STATUS,
  createdAt?: Date,
  updatedAt?: Date,
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'hidden' },
}, { timestamps: true })

withSoftDeletePlugin(ProductSchema)

const Product = model<IProduct, TSoftDeleteQueryHelpers<IProduct>>('Product', ProductSchema)

export default Product