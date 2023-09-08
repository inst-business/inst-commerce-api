import { Schema, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import { ITEM_STATUS } from '@/config/global/const'
import { TSuspendableDocument, withSoftDeletePlugin } from '@/utils/mongoose'
import _ from '@/utils/utils'
import { handleQuery } from '@/utils/mongoose'

export interface IProduct {
  name: string
  desc: string
  img: string
  slug: string
  status: ITEM_STATUS
  authorId: ObjectId
  categoryId: ObjectId
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
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


class ProductModel extends SuspendableModel<IProduct> {

  constructor () {
    super(Product)
  }

  async insertOne (product: IProduct): Promise<IProduct> {
    Object.assign(product, { slug: product.name })
    product.slug = product.name
    const q = Product.create(product)
    const res = await handleQuery(q, data => {
      data.slug = _.genUniqueSlug(product.name, data._id.toString())
      data.save()
    })
    return res.toObject()
  }
  
  // async updateOne (id: string, product: IProduct): Promise<IProduct | null> {
  //   product.slug = _.genUniqueSlug(product.name, id)
  //   const q = Product.findOneAndUpdate({ _id: id }, product)
  //   const res = await handleQuery(q)
  //   return res as I | null
  // }
  
}

export default ProductModel