import mongoose from 'mongoose'
import { TSuspendableDocument, handleQuery } from '@/utils/mongoose'
import _ from '@/utils/utils'
import { SORT_ORDER } from '@/config/global/const'
import ERR from '@/config/global/error'

class Model<I> {
  protected model: mongoose.Model<I>
  
  constructor (model: mongoose.Model<I>) {
    this.model = model
  }

  async getAll (): Promise<I[]> {
    const q = this.model.find({}).lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getMany (
    limit: number = 15,
    offset: number = 0,
    sort: SORT_ORDER = 'desc',
    sortBy: string = 'createdAt'
  ): Promise<I[]> {
    const q = this.model.find({})
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getOneById (id: string): Promise<I | null> {
    const q = this.model.findOne({ _id: id }).lean()
    const data = await handleQuery(q)
    return data as I | null
  }

  async getOneBySlug (slug: String): Promise<I | null> {
    const q = this.model.findOne({ slug: slug }).lean()
    const data = await handleQuery(q)
    return data as I | null
  }
  
  async insertOne (data: Partial<I>): Promise<I> {
    const q = this.model.create(data)
    const res = await handleQuery(q)
    return res.toObject()
  }

  async updateOne (id: string, data: Partial<I>): Promise<I | null> {
    const q = this.model.findOneAndUpdate({ _id: id }, data)
    const res = await handleQuery(q)
    return res as I | null
  }

  async getAllDeleted (): Promise<I[]> {
    const q = this.model.find({ isDeleted: true }).lean()
    const data = await handleQuery(q)
    return data as I[]
  }

  async getManyDeleted (
    limit: number = 15,
    offset: number = 0,
    sort: SORT_ORDER = 'desc',
    sortBy: string = 'deletedAt'
  ): Promise<I[]> {
    const q = this.model.find({ isDeleted: true })
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

  async getDeletedById (id: string): Promise<I | null> {
    const q = this.model.findOne({ _id: id, isDeleted: true }).lean()
    const data = await handleQuery(q)
    return data as I | null
  }

  async destroyOneOrMany (id: string | string[]): Promise<Record<string, any>> {
    const q = this.model.deleteOne({ _id: id, isDeleted: true })
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

  async deleteOneOrMany (id: string | string[]): Promise<Boolean> {
    const q = this.suspendableModel.find({ _id: id }).softDelete()
    const res = await handleQuery(q)
    return res
  }

  async restoreOneOrMany (id: string | string[]): Promise<Boolean> {
    const q = this.suspendableModel.find({ _id: id, isDeleted: true }).restoreDeleted()
    const res = await handleQuery(q)
    return res
  }
}


export class IndelibleModel<I> extends Model<I> {

  private errTitle: string = 'Access denied'
  private errMessage: string = 'You do not have permission.'
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