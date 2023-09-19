import CategoryModel, { ICategory } from '@models/Category'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { removeOneImage } from '@/services/LocalUploadService'
import { ROLES, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const Category = new CategoryModel()
const User = new UserModel()

class CategoryCtrl {

  // static test() {
  //   return _.routeAsync(async (req, res) => {
  //     return await Category.findImgById(req.params.id)
  //   })
  // }

  static createOne () {
    return _.routeAsync(async () => {},
    _.renderView('app/categories/create')
  )}

  static storeOne () {
    return _.routeAsync(async (req, res) => {
      const
        sign: USER_SIGN = (<any>req).user,
        user = await User.getAuthorizedUserByUsername(sign.username, ROLES.MANAGER)
      if (user == null) {
        throw _.logicError('Access Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      }
      if ((<any>req).errorUpload) {
        throw (<any>req).errorUpload
      }
      const
        keys = ['name', 'desc'],
        data = _.pickProps(<ICategory>req.body, keys)
      data.createdBy = user._id
      if (req.file != null && req.file.fieldname === 'img') {
        data.img = req.file.filename
      }
      const submittedCategory = await Category.insertOne(data)
        .catch(err => {
          removeOneImage('categories', data.img).catch(e => console.error(e?.message))
          throw err
        })
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
    _.renderView('app/categories/edit', true)
  )}

  static updateOne () {
    return _.routeAsync(async (req, res) => {
      const
        { id } = req.params,
        sign: USER_SIGN = (<any>req).user,
        user = await User.getAuthorizedUserByUsername(sign.username, ROLES.MANAGER)
      if (user == null) {
        throw _.logicError('Access Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      }
      if ((<any>req).errorUpload) {
        throw (<any>req).errorUpload
      }
      const
        keys = ['name', 'desc'],
        data = _.pickProps(<ICategory>req.body, keys),
        prevData = await Category.findImgById(id)
      if (req.file != null && req.file.fieldname === 'img') {
        data.img = req.file.filename
      }
      data.editedBy = user._id
      data.editedAt = new Date()
      const updatedCategory = await Category.updateOne(id, data)
        .then(async (updatedData) => {
          if (data.img != null && prevData?.img != null) {
            removeOneImage('categories', prevData.img).catch(e => console.error(e?.message))
          }
          return updatedData
        })
        .catch(() => {
          removeOneImage('categories', data.img).catch(e => console.error(e?.message))
        })
      return updatedCategory
    },
    // _.redirectView('/v1/categories/:id', 'id')
    // _.redirectView('back')
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
      const
        sign: USER_SIGN = (<any>req).user,
        user = await User.getAuthorizedUserByUsername(sign.username, ROLES.MANAGER)
      if (user == null) {
        throw _.logicError('Access Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      }
      const { id } = req.body
      const result = await Category.deleteOneOrMany(id, user._id)
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
      const prevData = await Category.findImgOfDeletedById(id)
      const result = await Category.destroyOneOrMany(id)
        .then(data => {
          if (prevData?.img == null) return data
          removeOneImage('categories', prevData.img).catch(e => console.error(e?.message))
        })
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