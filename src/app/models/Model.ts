import mongoose, { Document } from 'mongoose'
import { TSuspendableDocument, ArgumentId, handleQuery } from '@/utils/mongoose'
import _ from '@/utils/utils'
import { Keys, ExcludableKeys, Many, IResultWithPars, ExcludeKeys, SORT_ORDER } from '@/config/global/const'
import ERR from '@/config/global/error'


abstract class Model<I> {
  
  protected Model: mongoose.Model<I>
  
  constructor (Model: mongoose.Model<I>) {
    this.Model = Model
  }

  async getAll (selected?: ExcludableKeys<I>[]): Promise<I[]> {
    const q = this.Model.find({}).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getMany (
    selected?: ExcludableKeys<I>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<I> = 'createdAt' as any
  ): Promise<I[]> {
    const q = this.Model.find({})
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getOneById (id: ArgumentId, selected?: ExcludableKeys<I>[]): Promise<I | null> {
    const q = this.Model.findOne({ _id: id }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I | null
  }

  async getOneBySlug (slug: string, selected?: ExcludableKeys<I>[]): Promise<I | null> {
    const q = this.Model.findOne({ slug: slug }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I | null
  }
  
  async insertOne (data: Partial<I>): Promise<I> {
    const q = this.Model.create(data)
    const res = await handleQuery(q)
    return res
  }

  async updateOne (
    id: ArgumentId, data: Partial<I>,
    selected?: ExcludableKeys<I>[]
  ): Promise<I | null> {
    const q = this.Model.findOneAndUpdate({ _id: id }, data, { new: true })
      .select(selected?.join(' ') ?? '').lean()
    const res = await handleQuery(q)
    return res as I | null
  }

  async destroyOneOrMany (id: Many<ArgumentId>): Promise<Record<string, any>> {
    const q = this.Model.deleteMany({ _id: id })
    const res = await handleQuery(q)
    return res
  }

}
export default Model


export abstract class SuspendableModel<I> extends Model<I> {

  private SuspendableModel: TSuspendableDocument<I>
  
  constructor (Model: TSuspendableDocument<I>) {
    super(Model)
    this.SuspendableModel = Model
  }

  async getAllDeleted (selected?: ExcludableKeys<I>[]): Promise<I[]> {
    const q = this.Model.find({ isDeleted: true }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getManyDeleted (
    selected?: ExcludableKeys<I>[],
    limit = 15, offset = 0, sort: SORT_ORDER = 'desc',
    sortBy: Keys<I> = 'deletedAt' as any
  ): Promise<I[]> {
    const q = this.Model.find({ isDeleted: true })
      .select(selected?.join(' ') ?? '')
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data as I[]
  }
  
  async getDeletedAmount (): Promise<number> {
    const q = this.Model.find({ isDeleted: true }).countDocuments()
    const data = await handleQuery(q)
    return data
  }

  async getDeletedById (id: ArgumentId, selected?: ExcludableKeys<I>[]): Promise<I | null> {
    const q = this.Model.findOne({ _id: id, isDeleted: true }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data as I | null
  }

  async deleteOneOrMany (id: Many<ArgumentId>, deletedBy: ArgumentId): Promise<IResultWithPars> {
    const q = this.SuspendableModel.find({ _id: id }).softDelete(deletedBy)
    const res = await handleQuery(q)
    return res
  }

  async restoreOneOrMany (id: Many<ArgumentId>): Promise<IResultWithPars> {
    const q = this.SuspendableModel.find({ _id: id, isDeleted: true }).restoreDeleted()
    const res = await handleQuery(q)
    return res
  }

  async destroyOneOrMany (id: Many<ArgumentId>): Promise<Record<string, any>> {
    const q = this.Model.deleteMany({ _id: id, isDeleted: true })
    const res = await handleQuery(q)
    return res
  }

}


export abstract class IndelibleModel<I> extends Model<I> {

  private errTitle: string = 'Access denied'
  private errMessage: string = 'This action is not allowed.'
  private err: Error = _.logicError(this.errTitle, this.errMessage, 406, ERR.ACTION_REJECTED)

  // getAllDeleted (): any {
  //   throw this.err
  // }
  // getManyDeleted (): any {
  //   throw this.err
  // }
  // getDeletedAmount (): any {
  //   throw this.err
  // }
  // getDeletedById (): any {
  //   throw this.err
  // }
  destroyOneOrMany (): any {
    throw this.err
  }

}