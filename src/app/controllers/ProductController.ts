import ProductModel, { IProduct } from '@models/Product'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { ROLES, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const Product = new ProductModel()
const User = new UserModel()

class ProductCtrl {
  
  static createOne () {
    return _.routeAsync(async () => {},
    _.renderView('app/categories/create')
  )}

  static storeOne () {
    return _.routeAsync(async (req, res) => {
      const data = req.body
      const submittedProduct = await Product.insertOne(data)
      return submittedProduct
    },
    _.redirectView('/v1/products')
  )}
  
  static getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IProduct | null = await Product.getOneById(id)
      return data
    },
    _.renderView('app/products/detail')
  )}

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const resources = {
        'items': Product.getMany(),
        'deletedCount': Product.getDeletedAmount()
      }
      const data = _.fetchAllSettled(resources)
      return data
    },
    _.renderView('app/products/index')
  )}

  static editOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IProduct | null = await Product.getOneById(id)
      return data
    },
    _.renderView('app/products/edit')
  )}

  static updateOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data = req.body
      data.slug = _.genUniqueSlug(data.name, id)
      const updatedProduct = await Product.updateOne(id, data)
      return updatedProduct
    },
    _.redirectView('/products/:id', 'id')
  )}

  static getOneDeleted () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IProduct | null = await Product.getDeletedById(id)
      return data
    },
    _.renderView('app/products/deleted/detail')
  )}

  static getManyDeleted () {
    return _.routeAsync(async () => {
      const data: IProduct[] = await Product.getManyDeleted()
      return data
    },
    _.renderView('app/products/deleted/index')
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
      const result = await Product.deleteOneOrMany(id, user._id)
      return result
    },
    _.redirectView('back')
  )}
  
  static restoreOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const restoredProduct = await Product.restoreOneOrMany(id)
      return restoredProduct
    },
    _.redirectView('back')
  )}

  static destroyOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const result = await Product.destroyOneOrMany(id)
      return result
    },
    _.redirectView('back')
  )}

}

export default ProductCtrl


/** 
 *  EXTERNAL
*/
export class ProductExtCtrl {

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const data: IProduct[] = await Product.getMany()
      return data
    })
  }

  static getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const data: IProduct | null = await Product.getOneBySlug(slug)
      return data
    })
  }

}