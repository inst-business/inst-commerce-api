import CategoryModel, { ICategory } from '@models/Category'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { appendOneImage, removeOneImage, removeManyImages } from '@/services/LocalUploadService'
import { Keys, ExcludableKeys, ROLES, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const Category = new CategoryModel()
const User = new UserModel()
const fileUploadPrefix = 'upload-cat'

class CategoryCtrl {

  static test() {
    return _.routeAsync(async (req, res) => {
      const data = await Category.findImageById(req.params.id3 || [req.params.id, req.params.id2])
      return data
    })
  }

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
      data.slug = _.genSlug(data.name + '-' + _.genUniqueCode())
      data.createdBy = user._id
      if (req.file != null && req.file.fieldname === 'img') {
        data.img = _.genFileName(req.file.originalname, data.name, fileUploadPrefix)
      }
      const submittedCategory = await Category.insertOne(data)
        .then(data => {
          appendOneImage(<any>req.file, 'categories', data.img)
            .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
          return data
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
      const data = _.fetchAllSettled(resources)
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
        prevImage = await Category.findImageById(id)
      if (req.file != null && req.file.fieldname === 'img') {
        data.img = _.genFileName(req.file.originalname, data.name, fileUploadPrefix)
      }
      data.editedBy = user._id
      data.editedAt = new Date()
      const updatedCategory = await Category.updateOne(id, data)
        .then((updatedData) => {
          const dir = 'categories'
          appendOneImage(<any>req.file, dir, data.img)
            .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
          if (prevImage[0] != null) {
            removeOneImage(dir, prevImage[0])
              .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
          }
          return updatedData
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
      // console.log('content-type: ', req.headers['content-type'])
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
    // _.redirectView('back')
  )}
  
  static restoreOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const restoredCategory = await Category.restoreOneOrMany(id)
      return restoredCategory
    },
    // _.redirectView('back')
  )}

  static destroyOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const images = await Category.findImageOfDeletedById(id)
      const result = await Category.destroyOneOrMany(id)
        .then(data => {
          if (images.length > 0) {
            removeManyImages('categories', images)
              .catch(e => console.error(`${e?.message} (${e?.errorCode})`, e?.pars))
          }
          return data
        })
      return result
    },
    // _.redirectView('back')
  )}

}
export default CategoryCtrl


/** 
 *  EXTERNAL
*/
export class CategoryExtCtrl {

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const
        keys: ExcludableKeys<ICategory>[] = [
          '-_id', 'name', 'desc', 'img', 'slug', 'createdBy', 'createdAt'
        ],
        data: ICategory[] = await Category.getMany(),
        pickData = data.map(item => _.pickProps(item, [
          'name', 'desc', 'img', 'slug', 'createdBy', 'createdAt'
        ]))
      return pickData
    })
  }

  static getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const
        keys: ExcludableKeys<ICategory>[] = [
          '-_id', 'name', 'desc', 'img', 'slug', 'createdBy', 'createdAt'
        ],
        data: ICategory | null = await Category.getOneBySlug(slug, keys)
      return data
    })
  }

}