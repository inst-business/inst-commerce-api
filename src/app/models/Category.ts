import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import { User } from './User'
import { ITEM_STATUS } from '@/config/global/const'
import _ from '@/utils/utils'
import { handleQuery, TSuspendableDocument, withSoftDeletePlugin } from '@/utils/mongoose'

export interface ICategory extends Document {
  name: string
  desc: string
  img: string
  slug: string
  status: ITEM_STATUS
  authorId: ObjectId
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true, default: '' },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'pending' },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

withSoftDeletePlugin(CategorySchema)
const Category = model<ICategory, TSuspendableDocument<ICategory>>('Category', CategorySchema)


class CategoryModel extends SuspendableModel<ICategory> {

  constructor () {
    super(Category)
  }

  async insertOne (category: ICategory): Promise<ICategory> {
    // Object.assign(category, { slug: category.name })
    category.slug = category.name
    const q = Category.create(category)
    const res = await handleQuery(q, data => {
      data.slug = _.genUniqueSlug(category.name, data._id.toString())
      data.save()
    })
    return res.toObject()
  }
  
}

export default CategoryModel