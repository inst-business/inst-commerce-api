import Product, { IProduct } from '@models/Product'
import _ from '@/utils/utils'
import { handleQuery } from '@/utils/mongoose'
import { SORT_ORDER } from '@/config/global/const'

class ProductController {

  static async getAll (): Promise<IProduct[]> {
    const q = Product.find({}).lean()
    const data = await handleQuery(q)
    return data
  }

  static async getMany (
    limit: number = 15,
    offset: number = 0,
    sort: SORT_ORDER = 'desc',
    sortBy: string = 'createdAt'
  ): Promise<IProduct[]> {
    const q = Product.find({})
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }

  static async getOneById (id: string): Promise<IProduct | null> {
    const q = Product.findOne({ _id: id }).lean()
    const data = await handleQuery(q)
    return data
  }

  static async getOneBySlug (slug: String): Promise<IProduct | null> {
    const q = Product.findOne({ slug: slug }).lean()
    const data = await handleQuery(q)
    return data
  }
  
  static async insertOne (product: IProduct): Promise<IProduct> {
    const formData = structuredClone(product)
    formData.slug = product.name
    const q = Product.create(formData)
    const res = await handleQuery(q, data => {
      data.slug = _.genUniqueSlug(product.name, data._id.toString())
      data.save()
    })
    return res
  }

  static async updateOne (id: string, product: IProduct): Promise<IProduct | null> {
    const formData = structuredClone(product)
    formData.slug = _.genUniqueSlug(product.name, id)
    const q = Product.findOneAndUpdate({ _id: id }, formData)
    const res = await handleQuery(q)
    return res
  }
  
  static async deleteOneOrMany (ids: string | string[]): Promise<Boolean> {
    const q = Product.find({ _id: ids }).softDelete()
    const res = await handleQuery(q)
    return res
  }

  static async getAllDeleted (): Promise<IProduct[]> {
    const q = Product.find({ isDeleted: true }).lean()
    const data = await handleQuery(q)
    return data
  }

  static async getManyDeleted (
    limit: number = 15,
    offset: number = 0,
    sort: SORT_ORDER = 'desc',
    sortBy: string = 'deletedAt'
  ): Promise<IProduct[]> {
    const q = Product.find({ isDeleted: true })
      .sort({ [sortBy]: sort }).skip(offset).limit(limit)
      .lean()
    const data = await handleQuery(q)
    return data
  }
  
  static async getDeletedAmount (): Promise<number> {
    const q = Product.find({ isDeleted: true }).countDocuments()
    const data = await handleQuery(q)
    return data
  }

  static async getDeletedById (id: string): Promise<IProduct | null> {
    const q = Product.findOne({ _id: id, isDeleted: true }).lean()
    const data = await handleQuery(q)
    return data
  }

  static async restoreOneOrMany (ids: string | string[]): Promise<Boolean> {
    const q = Product.find({ _id: ids, isDeleted: true }).restoreDeleted()
    const res = await handleQuery(q)
    return res
  }
  static async destroyOneOrMany (id: string | string[]): Promise<Record<string, any>> {
    const q = Product.deleteOne({ _id: id, isDeleted: true })
    const res = await handleQuery(q)
    return res
  }

}

export default ProductController
