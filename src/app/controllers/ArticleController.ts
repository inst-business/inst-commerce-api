import Article, { IArticle } from '@models/Article'
import _ from '@/utils/utils'
import { handleQuery } from '@/utils/mongoose'

class ArticleController {

  static async getAll (): Promise<IArticle[]> {
    const q = Article.find({}).lean()
    const data = await handleQuery(q)
    return data
  }

  static async getOneById (id: string): Promise<IArticle | null> {
    const q = Article.findOne({ _id: id }).lean()
    const data = await handleQuery(q)
    return data
  }

  static async getOneBySlug (slug: String): Promise<IArticle | null> {
    const q = Article.findOne({ slug: slug }).lean()
    const data = await handleQuery(q)
    return data
  }
  
  static async insertOne (product: IArticle): Promise<IArticle> {
    const formData = structuredClone(product)
    formData.slug = product.name
    const q = Article.create(formData)
    const res = await handleQuery(q, data => {
      data.slug = _.genUniqueSlug(product.name, data._id.toString())
      data.save()
    })
    return res
  }

  static async updateOne (id: string, product: IArticle): Promise<IArticle | null> {
    const formData = structuredClone(product)
    formData.slug = _.genUniqueSlug(product.name, id)
    const q = Article.findOneAndUpdate({ _id: id }, formData)
    const res = await handleQuery(q)
    return res
  }
  
  static async deleteOneOrMany (ids: string | string[]): Promise<Boolean> {
    const q = Article.find({ _id: ids }).softDelete()
    const res = await handleQuery(q)
    return res
  }

  static async getAllDeleted (): Promise<IArticle[]> {
    const q = Article.find({ isDeleted: true }).lean()
    const data = await handleQuery(q)
    return data
  }
  
  static async getDeletedAmount (): Promise<number> {
    const q = Article.find({ isDeleted: true }).countDocuments()
    const data = await handleQuery(q)
    return data
  }

  static async getDeletedById (id: string): Promise<IArticle | null> {
    const q = Article.findOne({ _id: id, isDeleted: true }).lean()
    const data = await handleQuery(q)
    return data
  }

  static async restoreOneOrMany (ids: string | string[]): Promise<Boolean> {
    const q = Article.find({ _id: ids, isDeleted: true }).restoreDeleted()
    const res = await handleQuery(q)
    return res
  }
  static async destroyOneOrMany (id: string | string[]): Promise<Record<string, any>> {
    const q = Article.deleteOne({ _id: id, isDeleted: true })
    const res = await handleQuery(q)
    return res
  }

}

export default ArticleController