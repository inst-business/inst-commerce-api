import mongoose, { Document } from 'mongoose'
import { TSuspendableDocument, ArgumentId, handleQuery } from '@/utils/mongoose'
import _ from '@/utils/utils'
import { Keys, ExcludableKeys, Many, IResultWithPars, ExcludeKeys, SORT_ORDER } from '@/config/global/const'
import ERR from '@/config/global/error'

class Model<I> {
  protected model: mongoose.Model<I>
  
  constructor (model: mongoose.Model<I>) {
    this.model = model
  }

  async getAll (selected?: ExcludableKeys<I>[]): Promise<I[]> {
    const q = this.model.find({}).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getMany (
    selected?: ExcludableKeys<I>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<I> = 'createdAt' as any
  ): Promise<I[]> {
    const q = this.model.find({})
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getOneById (id: ArgumentId, selected?: ExcludableKeys<I>[]): Promise<I | null> {
    const q = this.model.findOne({ _id: id }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I | null
  }

  async getOneBySlug (slug: string, selected?: ExcludableKeys<I>[]): Promise<I | null> {
    const q = this.model.findOne({ slug: slug }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I | null
  }
  
  async insertOne (data: Partial<I>): Promise<I> {
    const q = this.model.create(data)
    const res = await handleQuery(q)
    return res
    // return res.toObject()
  }

  async updateOne (
    id: ArgumentId, data: Partial<I>,
    selected?: ExcludableKeys<I>[]
  ): Promise<I | null> {
    const q = this.model.findOneAndUpdate({ _id: id }, data, { new: true })
      .select(selected?.join(' ') ?? '').lean()
    const res = await handleQuery(q)
    return res as I | null
  }

  async getAllDeleted (selected?: ExcludableKeys<I>[]): Promise<I[]> {
    const q = this.model.find({ isDeleted: true }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getManyDeleted (
    selected?: ExcludableKeys<I>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<I> = 'deletedAt' as any
  ): Promise<I[]> {
    const q = this.model.find({ isDeleted: true })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data as I[]
  }
  
  async getDeletedAmount (): Promise<number> {
    const q = this.model.find({ isDeleted: true }).countDocuments()
    const data = await handleQuery(q)
    return data
  }

  async getDeletedById (id: ArgumentId, selected?: ExcludableKeys<I>[]): Promise<I | null> {
    const q = this.model.findOne({ _id: id, isDeleted: true }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I | null
  }

  async destroyOneOrMany (id: Many<ArgumentId>): Promise<Record<string, any>> {
    const q = this.model.deleteMany({ _id: id, isDeleted: true })
    const res = await handleQuery(q)
    return res
  }

}
export default Model


export class SuspendableModel<I> extends Model<I> {
  private suspendableModel: TSuspendableDocument<I>
  
  constructor (model: TSuspendableDocument<I>) {
    super(model)
    this.suspendableModel = model
  }

  async deleteOneOrMany (id: Many<ArgumentId>, deletedBy: ArgumentId): Promise<IResultWithPars> {
    const q = this.suspendableModel.find({ _id: id }).softDelete(deletedBy)
    const res = await handleQuery(q)
    return res
  }

  async restoreOneOrMany (id: Many<ArgumentId>): Promise<IResultWithPars> {
    const q = this.suspendableModel.find({ _id: id, isDeleted: true }).restoreDeleted()
    const res = await handleQuery(q)
    return res
  }
}


export class IndelibleModel<I> extends Model<I> {

  private errTitle: string = 'Access denied'
  private errMessage: string = 'This action is not allowed.'
  private err: Error = _.logicError(this.errTitle, this.errMessage, 403, ERR.ACTION_REJECTED)

  getAllDeleted (): any {
    throw this.err
  }
  getManyDeleted (): any {
    throw this.err
  }
  getDeletedAmount (): any {
    throw this.err
  }
  getDeletedById (): any {
    throw this.err
  }
  destroyOneOrMany (): any {
    throw this.err
  }
}