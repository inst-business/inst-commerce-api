import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  handleQuery, IEditedDetails, ISoftDeleted, withEditedDetails, withSoftDelete, TSuspendableDocument
} from '@/utils/mongoose'
import { GV, STATUS, STATUS_ARR, FLAG, FLAG_ARR } from '@/config/global/const'

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
    price: number
    discount?: number
  }[]
  meta: {
    views: number
    likes: number
    comments: number
    sold: number
    reviews: number
    rating?: number
  }
  status: STATUS['ITEM']
  author: ObjectId
  seller: ObjectId
  category?: ObjectId
  tags?: ObjectId[]
  flag?: {
    type: FLAG['ITEM']
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
  // sku: { type: String, unique: true, minlength: 3 },
  shortDesc: { type: String },
  longDesc: { type: String, required: true },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxlength: 208 },
  specs: {
    type: [{
      sku: { type: String, required: true, unique: true },
      price: { type: Number, required: true },
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
  status: { type: String, required: true, enum: STATUS_ARR.ITEM, default: 'pending' },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'UserSeller' },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'Seller' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: { type: [Schema.Types.ObjectId], ref: 'Tag' },
  flag: {
    type: { type: String, required: true, enum: FLAG_ARR.ITEM },
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
  
  // async updateOne (id: ArgumentId, product: IProduct): Promise<IProduct | null> {
  //   product.slug = _.genUniqueSlug(product.name, id)
  //   const q = Product.findOneAndUpdate({ _id: id }, product)
  //   const res = await handleQuery(q)
  //   return res as I | null
  // }
  
}

export default Product