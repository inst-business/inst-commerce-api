import Controller from '@controllers/Controller'
import Category, { ICategory } from '@models/Category'
import User, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { appendOneImage, removeOneImage, removeManyImages } from '@/services/LocalUploadService'
import { Keys, ExcludableKeys, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'


class CategoryController extends Controller {

  private Category: Category
  private User: User
  private uploadPrefix: string

  constructor () {
    super()
    this.Category = new Category()
    this.User = new User()
    this.uploadPrefix = 'upload-cat'
  }

  public test () {
    return _.routeAsync(async (req, res) => {
      const data = await this.Category.findImageById(req.params.id3 || [req.params.id, req.params.id2])
      return data
    })
  }

  public storeOne () {
    return _.routeAsync(async (req, res) => {
      const
        sign: USER_SIGN = (<any>req).user,
        // user = await User.getAuthorizedUserByUsername(sign.username, ROLES.MANAGER)
        user = await this.User.getUserByEmailOrUsername(sign?.username, sign?.username)
      if (user == null) {
        throw _.logicError('Access Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      }
      if ((<any>req).errorUpload) {
        throw (<any>req).errorUpload
      }
      const
        parentId = req.params.id,
        keys = ['name', 'slug', 'desc'],
        data = _.pickProps(<ICategory>req.body, keys)
      data.slug = _.genSlug((data.slug || data.name) + '-' + _.genUniqueCode())
      data.author = user._id
      // data.author = <any>'652521c8497013713c684e48'
      if (req.file != null && req.file.fieldname === 'thumbnail') {
        data.thumbnail = _.genFileName(req.file.originalname, data.name, this.uploadPrefix)
      }
      const submittedCategory = await this.Category.insertOne(data, parentId)
        .then(data => {
          appendOneImage(<any>req.file, 'categories', data.thumbnail).catch(e => console.error(`${e?.message} (${e?.errorCode})`))
          return data
        })
      return submittedCategory
    }
  )}
  
  public getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await this.Category.getOneById(id)
      return data
    }
  )}

  public getMany () {
    return _.routeAsync(async (req, res) => {
      const data: ICategory[] = await this.Category.getMany()
      return data
    }
  )}
  
  public getManyByParentId () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory[] = await this.Category.getManyByParentId(id)
      return data
    })
  }

  public updateOne () {
    return _.routeAsync(async (req, res) => {
      // const
      //   { id } = req.params,
      //   sign: USER_SIGN = (<any>req).user,
      //   user = await User.getAuthorizedUserByUsername(sign.username, ROLES.MANAGER)
      // if (user == null) {
      //   throw _.logicError('Access Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      // }
      // if ((<any>req).errorUpload) {
      //   throw (<any>req).errorUpload
      // }
      // const
      //   keys = ['name', 'slug', 'desc'],
      //   data = _.pickProps(<ICategory>req.body, keys)
      // let prevImage: string[]
      // if (req.file != null && req.file.fieldname === 'img') {
      //   data.img = _.genFileName(req.file.originalname, data.name, fileUploadPrefix)
      //   prevImage = await this.Category.findImageById(id)
      // }
      // data.slug = data.slug && _.genSlug(data.slug + '-' + _.genUniqueCode())
      // data.editedBy = user._id
      // data.editedAt = new Date()
      // const updatedCategory = this.Category.updateOne(id, data)
      //   .then(async (updatedData) => {
      //     if (data.img != null) {
      //       if (prevImage?.[0] != null) {
      //         removeOneImage('this.Category', prevImage[0]).catch(e => console.error(`${e?.message} (${e?.errorCode})`))
      //       }
      //       appendOneImage(<any>req.file, 'categories', data.img).catch(e => console.error(`${e?.message} (${e?.errorCode})`))
      //     }
      //     return updatedData
      //   })
      // const newdata = await updatedCategory
      // return newdata
    }
  )}

  public getOneDeleted () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await this.Category.getDeletedById(id)
      return data
    }
  )}

  public getManyDeleted () {
    return _.routeAsync(async () => {
      const data: ICategory[] = await this.Category.getManyDeleted()
      return data
    }
  )}

  public deleteOneOrMany () {
    return _.routeAsync(async (req, res) => {
      // // console.log('content-type: ', req.headers['content-type'])
      // const
      //   sign: USER_SIGN = (<any>req).user,
      //   user = await User.getAuthorizedUserByUsername(sign.username, ROLES.MANAGER)
      // if (user == null) {
      //   throw _.logicError('Access Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      // }
      // const { id } = req.body
      // const result = await this.Category.deleteOneOrMany(id, user._id)
      // return result
    }
  )}
  
  public restoreOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const restoredCategory = await this.Category.restoreOneOrMany(id)
      return restoredCategory
    }
  )}

  public destroyOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const images = await this.Category.findImageOfDeletedById(id)
      const result = await this.Category.destroyOneOrMany(id)
        .then(data => {
          if (images.length > 0) {
            removeManyImages('categories', images).catch(e => console.error(`${e?.message} (${e?.errorCode})`, e?.pars))
          }
          return data
        })
      return result
    }
  )}

}
export default CategoryController


/** 
 *  EXTERNAL
*/
export class CategoryExternalController {

  private Category: Category

  constructor () {
    this.Category = new Category()
  }

  public getMany () {
    return _.routeAsync(async (req, res) => {
      const
        keys: ExcludableKeys<ICategory>[] = [
          '-_id', 'name', 'desc', 'thumbnail', 'slug', 'author', 'createdAt'
        ],
        data: ICategory[] = await this.Category.getMany(keys)
      return data
    })
  }
  
  public getManyByParentSlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const parent = await this.Category.getOneBySlug(slug, ['_id'])
      if (parent == null) return []
      const
        keys: ExcludableKeys<ICategory>[] = [
          '-_id', 'name', 'desc', 'thumbnail', 'slug', 'author', 'createdAt'
        ],
        data: ICategory[] = await this.Category.getManyByParentId(parent._id, keys)
      return data
    })
  }

  public getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const
        keys: ExcludableKeys<ICategory>[] = [
          '-_id', 'name', 'desc', 'thumbnail', 'slug', 'author', 'createdAt'
        ],
        data: ICategory | null = await this.Category.getOneBySlug(slug, keys)
      return data
    })
  }

}


/** 
 *  VIEW RENDERING
*/
export class CategoryViewController {

  private Category: Category

  constructor () {
    this.Category = new Category()
  }

  public createOne () {
    return _.routeAsync(async () => {},
    _.renderView('app/categories/create')
  )}
  
  public createOneChild () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data = await this.Category.getOneById(id, ['name'])
      return data
    },
    _.renderView('app/categories/categorized/create')
  )}
  
  public getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await this.Category.getOneById(id)
      return data
    },
    _.renderView('app/categories/detail')
  )}

  public getMany () {
    return _.routeAsync(async (req, res) => {
      const resources = {
        'items': this.Category.getMany(),
        'deletedCount': this.Category.getDeletedAmount(),
      }
      const data = _.fetchAllSettled(resources)
      return data
    },
    _.renderView('app/categories/index')
  )}

  public getManyByParentId () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory[] = await this.Category.getManyByParentId(id)
      return data
    },
    // _.renderView('app/categories/index')
  )}
  
  public editOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await this.Category.getOneById(id)
      return data
    },
    _.renderView('app/categories/edit', true)
  )}

  public getOneDeleted () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: ICategory | null = await this.Category.getDeletedById(id)
      return data
    },
    _.renderView('app/categories/deleted/detail')
  )}

  public getManyDeleted () {
    return _.routeAsync(async () => {
      const data: ICategory[] = await this.Category.getManyDeleted()
      return data
    },
    _.renderView('app/categories/deleted/index')
  )}

}