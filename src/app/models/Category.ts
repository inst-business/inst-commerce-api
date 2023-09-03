import { Schema, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import { ITEM_STATUS } from '@/config/global/const'
import { TSuspendableDocument, withSoftDeletePlugin } from '@/utils/mongoose'

export interface ICategory {
  name: string,
  desc: string,
  img: string,
  slug: string,
  status: ITEM_STATUS,
  authorId: ObjectId,
  isDeleted?: boolean,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
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
  
}

export default CategoryModel