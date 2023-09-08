import CategoryModel, { ICategory } from '@models/Category'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'


const Category = new CategoryModel()
const User = new UserModel()

class CategoryCtrl {

  static createOne () {
    return _.routeAsync(async () => {},
    _.renderView('app/categories/create')
  )}

  static storeOne () {
    return _.routeAsync(async (req, res) => {
      const
        keys = ['name', 'desc'],
        data = _.pickProps(<ICategory>req.body, keys),
        userSign: USER_SIGN = (<any>req).user,
        user = await User.getUserByUsername(userSign.username)
        if (user == null) {
          throw _.logicError('Error', 'Unauthorized', 401, ERR.UNAUTHORIZED)
        }
      data.authorId = user._id
      const submittedCategory = await Category.insertOne(data)
      return submittedCategory
    },
    // _.redirectView('/v1/categories')
  )}
  
  static getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await Category.getOneById(id)
      return data
    },
    _.renderView('app/categories/detail')
  )}

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const resources = {
        'items': Category.getMany(),
        'deletedCount': Category.getDeletedAmount()
      }
      const data = _.asyncAllSettled(resources)
      return data
    },
    _.renderView('app/categories/index')
  )}

  static editOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await Category.getOneById(id)
      return data
    },
    _.renderView('app/categories/create')
  )}

  static updateOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data = req.body
      const updatedCategory = await Category.updateOne(id, data)
      return updatedCategory
    },
    _.redirectView('/v1/categories/:id', 'id')
  )}

  static getOneDeleted () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await Category.getDeletedById(id)
      return data
    },
    _.renderView('app/categories/deleted/detail')
  )}

  static getManyDeleted () {
    return _.routeAsync(async () => {
      const data: ICategory[] = await Category.getManyDeleted()
      return data
    },
    _.renderView('app/categories/deleted/index')
  )}

  static deleteOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const result = await Category.deleteOneOrMany(id)
      return result
    },
    _.redirectView('back')
  )}
  
  static restoreOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const restoredCategory = await Category.restoreOneOrMany(id)
      return restoredCategory
    },
    _.redirectView('back')
  )}

  static destroyOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const result = await Category.destroyOneOrMany(id)
      return result
    },
    _.redirectView('back')
  )}

}
export default CategoryCtrl


/** 
 *  EXTERNAL
*/
export class CategoryExtCtrl {

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const data: ICategory[] = await Category.getMany()
      return data
    })
  }

  static getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const data: ICategory | null = await Category.getOneBySlug(slug)
      return data
    })
  }

}