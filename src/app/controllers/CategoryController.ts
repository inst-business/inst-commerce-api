import Controller from './Controller'
import CategoryModel, { ICategory } from '@models/Category'
import _ from '@/utils/utils'
import { SORT_ORDER } from '@/config/global/const'

const Category = new CategoryModel()

class CategoryCtrl {

  static createOne = _.routeAsync(async () => {},
    _.renderView('categories/create')
  )

  static storeOne = _.routeAsync(async (req, res) => {
    const data = req.body
    const submittedCategory = await Category.insertOne(data)
    return submittedCategory
  },
    _.redirectView('/v1/categories/d')
  )
  
  static getOne = _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: ICategory | null = await Category.getOneById(id)
    return data
  },
    _.renderView('categories/detail')
  )

  static getMany = _.routeAsync(async (req, res) => {
    const resources = {
      'items': Category.getMany(),
      'deletedCount': Category.getDeletedAmount()
    }
    const data = _.asyncAllSettled(resources)
    return data
  },
    _.renderView('categories/index')
  )

  static editOne = _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: ICategory | null = await Category.getOneById(id)
    return data
  },
    _.renderView('categories/create')
  )

  static updateOne = _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const updatedCategory = await Category.updateOne(id, data)
    return updatedCategory
  },
    _.redirectView('/categories/:id', 'id')
  )

  static getOneDeleted = _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: ICategory | null = await Category.getDeletedById(id)
    return data
  },
    _.renderView('categories/deleted/detail')
  )

  static getManyDeleted = _.routeAsync(async () => {
    const data: ICategory[] = await Category.getManyDeleted()
    return data
  },
    _.renderView('categories/deleted/index')
  )

  static deleteOneOrMany = _.routeAsync(async (req, res) => {
    const { id } = req.body
    const result = await Category.deleteOneOrMany(id)
    return result
  },
    _.redirectView('back')
  )
  
  static restoreOne = _.routeAsync(async (req, res) => {
    const { id } = req.body
    const restoredCategory = await Category.restoreOneOrMany(id)
    return restoredCategory
  },
    _.redirectView('back')
  )

  static destroyOneOrMany = _.routeAsync(async (req, res) => {
    const { id } = req.body
    const result = await Category.destroyOneOrMany(id)
    return result
  },
    _.redirectView('back')
  )

}
export default CategoryCtrl


/** 
 *  EXTERNAL
*/
export class CategoryExtCtrl {

  static getMany = _.routeAsync(async (req, res) => {
    const data: ICategory[] = await Category.getAll()
    return data
  })

  static getOneBySlug = _.routeAsync(async (req, res) => {
    const { slug } = req.params
    const data: ICategory | null = await Category.getOneBySlug(slug)
    return data
  })

}
