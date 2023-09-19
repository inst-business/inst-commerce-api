import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import { User } from './User'
import _ from '@/utils/utils'
import {
  handleQuery, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { ExcludeKeys, ITEM_STATUS, SORT_ORDER } from '@/config/global/const'

export interface ICategory extends Document {
  name: string
  desc: string
  img: string
  slug: string
  status: ITEM_STATUS
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
  editedBy?: ObjectId
  editedAt?: Date
  isDeleted: boolean
  deletedBy?: ObjectId
  deletedAt?: Date
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, maxLength: 255 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, maxLength: 255 },
  status: { type: String, required: true, default: 'pending' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// CategorySchema.virtual('author', {
//   ref: 'User',
//   localField: 'authorId',
//   foreignField: '_id',
//   justOne: true
// })

withEditedDetails(CategorySchema, 'User')
withSoftDelete(CategorySchema, 'User')
const Category = model<ICategory, TSuspendableDocument<ICategory>>('Category', CategorySchema)


class CategoryModel extends SuspendableModel<ICategory> {

  constructor () {
    super(Category)
  }

  async getMany (
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: ExcludeKeys<ICategory, Document> = 'createdAt'
  ): Promise<ICategory[]> {
    const q = Category.find({})
      .populate({ path: 'createdBy', select: 'username -_id' })
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneById (id: string): Promise<ICategory | null> {
    const q = Category.findById(id)
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneBySlug (slug: String): Promise<ICategory | null> {
    const q = Category.findOne({ slug })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async insertOne (category: ICategory): Promise<ICategory> {
    category.slug = category.name
    const q = Category.create(category)
    const res = await handleQuery(q, data => {
      data.slug = _.genUniqueSlug(category.name, data._id.toString())
      data.save()
    })
    return res
  }
  
  async getManyDeleted (
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: ExcludeKeys<ICategory, Document> = 'deletedAt'
  ): Promise<ICategory[]> {
    const q = Category.find({ isDeleted: true })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'deletedBy', select: 'username -_id' })
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  async findImgById (id: string): Promise<Pick<ICategory, 'img'> | null> {
    const q = Category.findOne({ _id: id }).select('img -_id').lean()
    const data = await handleQuery(q)
    return data
  }

  async findImgOfDeletedById (id: string): Promise<Pick<ICategory, 'img'> | null> {
    const q = Category.findOne({ _id: id, isDeleted: true }).select('img -_id').lean()
    const data = await handleQuery(q)
    return data
  }
  
}

export default CategoryModel