import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, ISoftDeleted, IEditedDetails, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import {
  GV, Many, Keys, ExcludableKeys, SORT_ORDER,
  STATUS, STATUS_ARR, FLAG_ARR, FLAG
} from '@/config/global/const'

export interface ICategory extends IEditedDetails, ISoftDeleted {
  _id: ObjectId
  left: number
  right: number
  name: string
  desc: string
  thumbnail: string
  slug: string
  specs?: {
    name: string,
    unit?: string,
    desc?: string
  }[]
  status: STATUS['ITEM']
  author: ObjectId
  isImmutable?: boolean
  expiresAt?: Date  // automatically destroyed if containing no product
  createdAt: Date
  updatedAt: Date
}

type TCategoryDocument = ICategory & Document

const CategorySchema = new Schema<ICategory>({
  left: { type: Number, required: true },
  right: { type: Number, required: true },
  name: { type: String, required: true, minlength: 1, maxlength: 48 },
  desc: { type: String },
  thumbnail: { type: String, required: true },
  slug: { type: String, required: true, unique: true, maxlength: 64 },
  specs: [{
    name: { type: String, required: true, minlength: 1, maxlength: 16 },
    unit: { type: String },
    desc: { type: String },
  }],
  status: { type: String, required: true, enum: STATUS_ARR.ITEM, default: 'pending' },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
  isImmutable: { type: Boolean },
  expiresAt: { type: Date, index: { expires: GV.TEMP_DATA_EXPIRED } },
}, { timestamps: true })

// CategorySchema.virtual('author', {
//   ref: 'User',
//   localField: 'authorId',
//   foreignField: '_id',
//   justOne: true
// })

withEditedDetails(CategorySchema, 'User')
withSoftDelete(CategorySchema, 'User')
const CategoryModel = model<ICategory, TSuspendableDocument<ICategory>>('Category', CategorySchema)


class Category extends SuspendableModel<ICategory> {

  constructor () {
    super(CategoryModel)
  }

  async getMany (
    selected?: ExcludableKeys<ICategory>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<ICategory> = 'createdAt'
  ): Promise<ICategory[]> {
    const q = this.Model.find({ left: 1 })
      // .populate({ path: 'categorizedBy', select: 'name -_id' })
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
    const parent = await this.Model.findById(id)
    if (parent == null) return []
    const q = this.Model.find({ left: { $gte: parent.left, $lte: parent.right } })
      // .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneById (id: ArgumentId, selected?: ExcludableKeys<ICategory>[]): Promise<ICategory | null> {
    const q = this.Model.findById(id)
      // .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneBySlug (slug: String, selected?: ExcludableKeys<ICategory>[]) {
    const q = this.Model.findOne({ slug })
      // .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async insertOne (category: ICategory, id?: ArgumentId): Promise<ICategory> {
    category.left = 1
    category.right = 2
    const parent = await this.Model.findById(id)
    if (parent != null) {
      category.left = parent.right
      category.right = parent.right + 1
      const rightSibling = await this.Model.findOne({ left: parent.right })
      if (rightSibling != null) await handleQuery(
        this.Model.updateMany({ left: { $gte: parent.right } }, { $inc: { left: 2, right: 2 } })
      )
      parent.right += 2
      await handleQuery(parent.save())
    }
    const q = this.Model.create(category)
    const res = await handleQuery(q)
    return res
  }
  
  async getManyDeleted (
    selected?: ExcludableKeys<ICategory>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<ICategory> = 'deletedAt'
  ): Promise<ICategory[]> {
    const q = this.Model.find({ isDeleted: true })
      // .populate({ path: 'categorizedBy', select: 'name -_id' })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'deletedBy', select: 'username -_id' })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  async findImageById (id: Many<ArgumentId>): Promise<ICategory['thumbnail'][]> {
    const q = this.Model.find({ _id: id }).select('img -_id').lean()
    const data = await handleQuery(q)
    return data.map(item => item.thumbnail)
  }

  // async findImgByManyIds (id: Many<ArgumentId>): Promise<Pick<ICategory, 'img'>[]> {
  //   const q = Category.find({ _id: id }).select('img -_id').lean()
  //   const data = await handleQuery(q)
  //   return data
  // }

  async findImageOfDeletedById (id: Many<ArgumentId>): Promise<ICategory['thumbnail'][]> {
    const q = this.Model.find({ _id: id, isDeleted: true }).select('img -_id').lean()
    const data = await handleQuery(q)
    return data.map(item => item.thumbnail)
  }
  
}

export default Category