import Product, { IProduct } from '@models/Product'
import _ from '@/utils/utils'

class ProductController {

  static async getAll (): Promise<IProduct[]> {
    const query = Product.find({}).lean()
    const data = await query
    return data
  }

  static async getOneById (id: string): Promise<IProduct | null> {
    const query = Product.findOne({ _id: id }).lean()
    const data = await query
    return data
  }

  static async getOneBySlug (slug: String): Promise<IProduct | null> {
    const query = Product.findOne({ slug: slug }).lean()
    const data = await query
    return data
  }
  
  static async insertOne (product: IProduct): Promise<IProduct> {
    const formData = structuredClone(product)
    formData.slug = product.name
    const query = Product.create(formData)
    const res = await query
    if (res) {
      res.slug = _.genUniqueSlug(product.name, res._id.toString())
      res.save()
    }
    return res
  }

  static async updateOne (id: string, product: IProduct): Promise<IProduct | null> {
    const formData = product
    formData.slug = _.genUniqueSlug(product.name, id)
    const query = Product.findOneAndUpdate({ _id: id }, formData)
    const res = await query
    return res
  }
  
  static async deleteOneOrMany (ids: string | string[]): Promise<Object> {
    const query = Product.find({ _id: ids }).softDelete()
    const res = await query
    return res
  }

  static async getAllDeleted (): Promise<IProduct[]> {
    const query = Product.find({ isDeleted: true }).lean()
    const data = await query
    return data
  }

  static async getDeletedById (id: string): Promise<IProduct | null> {
    const query = Product.findOne({ _id: id, isDeleted: true }).lean()
    const data = await query
    return data
  }

  static async restoreOneOrMany (ids: string | string[]): Promise<Object> {
    const query = Product.find({ _id: ids, isDeleted: true }).restoreDeleted()
    const res = await query
    return res
  }

  static async destroyOneOrMany (id: string | string[]): Promise<Object> {
    const query = Product.deleteOne({ _id: id, isDeleted: true })
    const res = await query
    return res
  }

}

export default ProductController
