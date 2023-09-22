import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { ExcludeKeys, ITEM_STATUS, SORT_ORDER } from '@/config/global/const'

export interface IMusic {
  name: string
  artist: string
  path: string
  cover?: string
  desc?: string
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

type TMusicDocument = IMusic & Document

const MusicSchema = new Schema<IMusic>({
  name: { type: String, required: true, maxLength: 255 },
  artist: { type: String, required: true, maxLength: 255 },
  path: { type: String, required: true },
  cover: { type: String },
  desc: { type: String },
  status: { type: String, required: true, default: 'active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// MusicSchema.virtual('author', {
//   ref: 'User',
//   localField: 'authorId',
//   foreignField: '_id',
//   justOne: true
// })

withEditedDetails(MusicSchema, 'User')
withSoftDelete(MusicSchema, 'User')
const Music = model<IMusic, TSuspendableDocument<IMusic>>('Music', MusicSchema)


class MusicModel extends SuspendableModel<IMusic> {

  constructor () {
    super(Music)
  }

  async getMany (
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: ExcludeKeys<IMusic, Document> = 'createdAt'
  ): Promise<IMusic[]> {
    const q = Music.find({})
      .populate({ path: 'createdBy', select: 'username -_id' })
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }

  async getOneById (id: ArgumentId): Promise<IMusic | null> {
    const q = Music.findById(id)
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'editedBy', select: 'username -_id' })
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  async getManyDeleted (
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: ExcludeKeys<IMusic, Document> = 'deletedAt'
  ): Promise<IMusic[]> {
    const q = Music.find({ isDeleted: true })
      .populate({ path: 'createdBy', select: 'username -_id' })
      .populate({ path: 'deletedBy', select: 'username -_id' })
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  async findCoverById (id: ArgumentId): Promise<Pick<IMusic, 'cover'> | null> {
    const q = Music.findOne({ _id: id }).select('cover -_id').lean()
    const data = await handleQuery(q)
    return data
  }

  async findCoverOfDeletedById (id: ArgumentId): Promise<Pick<IMusic, 'cover'> | null> {
    const q = Music.findOne({ _id: id, isDeleted: true }).select('cover -_id').lean()
    const data = await handleQuery(q)
    return data
  }
  
}

export default MusicModel