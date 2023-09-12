import ArticleModel, { IArticle } from '@models/Article'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { ROLES, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const Article = new ArticleModel()
const User = new UserModel()

class ArticleCtrl {

  static createOne () {
    return _.routeAsync(async () => {},
    _.renderView('app/categories/create')
  )}

  static storeOne () {
    return _.routeAsync(async (req, res) => {
      const data = req.body
      const submittedArticle = await Article.insertOne(data)
      return submittedArticle
    },
    _.redirectView('/v1/articles')
  )}
  
  static getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IArticle | null = await Article.getOneById(id)
      return data
    },
    _.renderView('app/articles/detail')
  )}

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const resources = {
        'items': Article.getMany(),
        'deletedCount': Article.getDeletedAmount()
      }
      const data = _.asyncAllSettled(resources)
      return data
    },
    _.renderView('app/articles/index')
  )}

  static editOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IArticle | null = await Article.getOneById(id)
      return data
    },
    _.renderView('app/articles/create')
  )}

  static updateOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data = req.body
      data.slug = _.genUniqueSlug(data.name, id)
      const updatedArticle = await Article.updateOne(id, data)
      return updatedArticle
    },
    _.redirectView('/articles/:id', 'id')
  )}

  static getOneDeleted () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IArticle | null = await Article.getDeletedById(id)
      return data
    },
    _.renderView('app/articles/deleted/detail')
  )}

  static getManyDeleted () {
    return _.routeAsync(async () => {
      const data: IArticle[] = await Article.getManyDeleted()
      return data
    },
    _.renderView('app/articles/deleted/index')
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
      const result = await Article.deleteOneOrMany(id, user._id)
      return result
    },
    _.redirectView('back')
  )}
  
  static restoreOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const restoredArticle = await Article.restoreOneOrMany(id)
      return restoredArticle
    },
    _.redirectView('back')
  )}

  static destroyOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const result = await Article.destroyOneOrMany(id)
      return result
    },
    _.redirectView('back')
  )}

}

export default ArticleCtrl


/** 
 *  EXTERNAL
*/
export class ArticleExtCtrl {

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const data: IArticle[] = await Article.getMany()
      return data
    })
  }

  static getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const data: IArticle | null = await Article.getOneBySlug(slug)
      return data
    })
  }

}