import { ObjectId } from 'mongoose';
import MusicModel, { IMusic } from '@models/Music'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { removeOneImage } from '@/services/LocalUploadService'
import { ROLES, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const Music = new MusicModel()
const User = new UserModel()

class MusicCtrl {

  // static test() {
  //   return _.routeAsync(async (req, res) => {
  //     return await Music.findImgById(req.params.id)
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
      // if ((<any>req).errorUpload) {
      //   throw (<any>req).errorUpload
      // }
      const
        keys = ['name', 'artist', 'path', 'cover', 'desc'],
        data = _.pickProps(<IMusic>req.body, keys)
      data.createdBy = user._id
      // if (req.file != null && req.file.fieldname === 'cover') {
      //   data.cover = req.file?.filename
      // }
      // console.log('ctrl: ', data)
      const submittedMusic = await Music.insertOne(data)
        // .catch(err => {
        //   removeOneImage('musics/covers', <string>req.file?.filename)
        //     .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
        //   throw err
        // })
      return submittedMusic
    },
    // _.redirectView('/v1/categories')
  )}
  
  static getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IMusic | null = await Music.getOneById(id)
      return data
    },
    _.renderView('app/categories/detail')
  )}

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const resources = {
        'items': Music.getMany(),
        'deletedCount': Music.getDeletedAmount()
      }
      const data = _.fetchAllSettled(resources)
      return data
    },
    _.renderView('app/categories/index')
  )}

  static editOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IMusic | null = await Music.getOneById(id)
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
        data = _.pickProps(<IMusic>req.body, keys),
        prevData = await Music.findCoverById(id)
      if (req.file != null && req.file.fieldname === 'cover') {
        data.cover = req.file.filename
      }
      data.editedBy = user._id
      data.editedAt = new Date()
      const updatedMusic = await Music.updateOne(id, data)
        .then(async (updatedData) => {
          if (data.cover != null && prevData?.cover != null) {
            removeOneImage('musics/covers', prevData.cover)
              .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
          }
          return updatedData
        })
        .catch(() => {
          removeOneImage('musics/covers', <string>req.file?.filename)
            .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
        })
      return updatedMusic
    },
    // _.redirectView('/v1/categories/:id', 'id')
    // _.redirectView('back')
  )}

  static getOneDeleted () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IMusic | null = await Music.getDeletedById(id)
      return data
    },
    _.renderView('app/categories/deleted/detail')
  )}

  static getManyDeleted () {
    return _.routeAsync(async () => {
      const data: IMusic[] = await Music.getManyDeleted()
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
      const result = await Music.deleteOneOrMany(id, user._id)
      return result
    },
    // _.redirectView('back')
  )}
  
  static restoreOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const restoredMusic = await Music.restoreOneOrMany(id)
      return restoredMusic
    },
    // _.redirectView('back')
  )}

  static destroyOneOrMany () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.body
      const prevData = await Music.findCoverOfDeletedById(id)
      const result = await Music.destroyOneOrMany(id)
        .then(data => {
          if (prevData?.cover == null) return data
          removeOneImage('categories', prevData.cover)
            .catch(e => console.error(`${e?.message} (${e?.errorCode})`))
        })
      return result
    },
    // _.redirectView('back')
  )}

}
export default MusicCtrl


/** 
 *  EXTERNAL
*/
export class MusicExtCtrl {

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const data: IMusic[] = await Music.getMany()
      return data
    })
  }

  static getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const
        data: IMusic | null = await Music.getOneBySlug(slug),
        pickData = data && _.pickProps(data, [
          'name', 'desc', 'img', 'slug', 'createdBy', 'createdAt'
        ])
      return pickData
    })
  }

}