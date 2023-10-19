import { Schema, Document, model, ObjectId, Decimal128 } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  handleQuery, IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { GV, ITEM_STATUS, FLAG } from '@/config/global/const'

export interface IProduct extends IEditedDetails, ISoftDeleted {
  _id: ObjectId
  expiresAt?: Date
  name: string
  shortDesc: string
  longDesc: string
  img: string
  slug: string
  specs: {
    sku: string
    price: number | Decimal128
    discount?: number
  }[]
  meta: {
    views: number
    likes: number
    comments: number
    sold: number
    reviews: number
    rating: number | Decimal128
  }
  status: ITEM_STATUS
  author: ObjectId
  seller: ObjectId
  category?: ObjectId
  tags?: ObjectId[]
  flag?: {
    tier: FLAG
    // reason: string
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

type TProductDocument = IProduct & Document

const ProductSchema = new Schema<IProduct>({
  expiresAt: { type: Date, index: { expires: GV.TEMP_DATA_EXPIRED } },
  name: { type: String, required: true, minlength: 3, maxlength: 192 },
  shortDesc: { type: String },
  longDesc: { type: String, required: true },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxlength: 208 },
  specs: {
    type: [{
      sku: { type: String, required: true, unique: true },
      price: { type: Schema.Types.Decimal128, required: true },
      discount: { type: Number },
    }],
    required: true,
    validate: {
      validator: (v: IProduct['specs']) => Array.isArray(v) && v.length > 0,
      message: 'Product requires at least 1 spec.'
    }
  },
  meta: {
    type: {
      views: { type: Number, required: true, min: 0, default: 0 },
      likes: { type: Number, required: true, min: 0, default: 0 },
      comments: { type: Number, required: true, min: 0, default: 0 },
      sold: { type: Number, required: true, min: 0, default: 0 },
      reviews: { type: Number, required: true, min: 0, default: 0 },
      rating: { type: Schema.Types.Decimal128, min: 1, max: 5 },
    },
    required: true
  },
  status: { type: Number, required: true, enum: ITEM_STATUS, default: ITEM_STATUS.PENDING },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'UserSeller' },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'Seller' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  flag: {
    type: { type: Number, required: true, enum: FLAG },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
    flaggedAt: { type: Date },
  },
}, { timestamps: true })

withEditedDetails(ProductSchema, 'User')
withSoftDelete(ProductSchema, 'User')

const ProductModel = model<IProduct, TSuspendableDocument<IProduct>>('Product', ProductSchema)


class Product extends SuspendableModel<IProduct> {

  constructor () {
    super(ProductModel)
  }

  async insertOne (product: IProduct): Promise<IProduct> {
    Object.assign(product, { slug: product.name })
    product.slug = product.name
    const q = ProductModel.create(product)
    const res = await handleQuery(q, data => {
      data.slug = _.genUniqueSlug(product.name, data._id.toString())
      data.save()
    })
    return res
  }
  
}

export default Product