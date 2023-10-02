import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { Many, Keys, ExcludableKeys, ITEM_STATUS, SORT_ORDER } from '@/config/global/const'

export interface ICategory {
  _id: ObjectId
  name: string
  desc: string
  img: string
  slug: string
  status: ITEM_STATUS
  categorizedBy?: ObjectId
  // left: number
  // right: number
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
  editedBy?: ObjectId
  editedAt?: Date
  isDeleted: boolean
  deletedBy?: ObjectId
  deletedAt?: Date
}

type TCategoryDocument = ICategory & Document

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, minlength: 1, maxlength: 48 },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, required: true, unique: true, maxlength: 64 },
  status: { type: String, required: true, default: 'pending' },
  categorizedBy: { type: Schema.Types.ObjectId, ref: 'Category' },
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
    selected?: ExcludableKeys<ICategory>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<ICategory> = 'createdAt'
  ): Promise<ICategory[]> {
    const q = Category.find({ categorizedBy: { $exists: false } })
      .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  async getManyByParentId (
    id: ArgumentId,
    selected?: ExcludableKeys<ICategory>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<ICategory> = 'createdAt'
  ): Promise<ICategory[]> {
    const q = Category.find({ categorizedBy: id })
      .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneById (id: ArgumentId, selected?: ExcludableKeys<ICategory>[]): Promise<ICategory | null> {
    const q = Category.findById(id)
      .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneBySlug (slug: String, selected?: ExcludableKeys<ICategory>[]) {
    const q = Category.findOne({ slug })
      .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .lean()
    const data = await handleQuery(q)
    return data
  }

  // async insertOne (category: ICategory): Promise<ICategory> {
  //   category.slug = category.name
  //   const q = Category.create(category)
  //   const res = await handleQuery(q, data => {
  //     data.slug = _.genUniqueSlug(category.name, data._id.toString())
  //     data.save()
  //   })
  //   return res
  // }
  
  async getManyDeleted (
    selected?: ExcludableKeys<ICategory>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<ICategory> = 'deletedAt'
  ): Promise<ICategory[]> {
    const q = Category.find({ isDeleted: true })
      .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'deletedBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  async findImageById (id: Many<ArgumentId>): Promise<ICategory['img'][]> {
    const q = Category.find({ _id: id }).select('img -_id').lean()
    const data = await handleQuery(q)
    return data.map(item => item.img)
  }

  // async findImgByManyIds (id: Many<ArgumentId>): Promise<Pick<ICategory, 'img'>[]> {
  //   const q = Category.find({ _id: id }).select('img -_id').lean()
  //   const data = await handleQuery(q)
  //   return data
  // }

  async findImageOfDeletedById (id: Many<ArgumentId>): Promise<ICategory['img'][]> {
    const q = Category.find({ _id: id, isDeleted: true }).select('img -_id').lean()
    const data = await handleQuery(q)
    return data.map(item => item.img)
  }
  
}

export default CategoryModel