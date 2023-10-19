import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import multer, {
  diskStorage, memoryStorage, MulterError
} from 'multer'
import sharp from 'sharp'
import slugify from 'slugify'
import _ from '@/utils/utils'
import LogicError from '@/utils/logicError'
import { GV } from '@/config/global/const'
import ERR from '@/config/global/error'


const uploadImage = (maxSize?: number) =>
// const uploadImage = (dest: string, prefix: string, maxSize?: number) =>
  multer({
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      const isMimeTypeAllowed = GV.IMG_MIMETYPES_ALLOWED.includes(file.mimetype)
      const isExtensionAllowed = GV.IMG_EXTENSIONS_ALLOWED.includes(path.extname(file.originalname))
      if (!isMimeTypeAllowed || !isExtensionAllowed) {
        const errMsg = 'Uploaded file(s) not allowed. Supported types: ' +
          GV.IMG_EXTENSIONS_ALLOWED.join(', ')
        return cb(_.logicError('Unsupported Type', errMsg, 415, ERR.INVALID_FORMAT))
      }
      cb(null, GV.IMG_MIMETYPES_ALLOWED.includes(file.mimetype))
    },
    // storage: diskStorage({
    //   destination: path.join(GV.UPLOADED_PATH, dest),
    //   filename: function (req, file, cb) {
    //     const
    //       ext = path.extname(file.originalname),
    //       originalName = req.body.name || path.basename(file.originalname, ext),
    //       name = _.genSlug(_.genUniqueCode(prefix) + '-' + originalName)
    //     cb(null, name + ext)
    //   }
    // }),
    storage: memoryStorage(),
  })
  
const handleMulterError = (err: MulterError | LogicError, req: Request) => {
  if (err instanceof MulterError) {
    const errMsg = 'Service has been crashed unexpectedly, please try again later.';
    (<any>req).errorUpload = _.logicError('Upload Fail', errMsg, 500, ERR.SERVICE_ERROR)
    return
  }
  (<any>req).errorUpload = err
}

export const uploadOneImage = (fieldName: string, maxSize?: number) =>
  _.routeNextableAsync(async (req, res, next) => {
    uploadImage(maxSize).single(fieldName)(req, res, (err) => {
      console.log(req.body, req.body.name)
      if (err) return handleMulterError(err, req)
    })
    next()
  })

export const appendOneImage = async (file: Express.Multer.File, dir: string, fileName?: string) => { 
  await new Promise(() => {
    const name = fileName || _.genFileName(file.originalname)
    const dest = path.join(GV.UPLOADED_PATH, dir, name)
    fs.writeFileSync(dest, file.buffer)
  }).catch(err => {
    throw _.logicError(err.name, err.message, 404, ERR.OBJECT_NOT_FOUND, err.path)
  })
}

export const removeOneImage = async (dir: string, fileName: string) => {
  await new Promise(() => {
    const dest = path.join(GV.UPLOADED_PATH, dir || '', fileName || '')
    fs.unlinkSync(dest)
  }).catch(err => {
    throw _.logicError(err.name, err.message, 404, ERR.OBJECT_NOT_FOUND, err.path)
  })
}

export const removeManyImages = async (dir: string, fileNames: string[]) => {
  const _removeManyImages = await Promise.allSettled(
    fileNames.map(filename => new Promise(() => {
      const dest = path.join(GV.UPLOADED_PATH, dir || '', filename || '')
      fs.unlinkSync(dest)
    }))
  )
  const rejectedImages = new Array()
  for (const res of _removeManyImages) {
    if (res.status === 'rejected') {
      rejectedImages.push({
        path: res.reason?.path,
        message: res.reason?.message,
      })
    }
  }
  const rejectedLength = rejectedImages.length
  if (rejectedLength > 0) {
    throw _.logicError('Not found', `Unable to remove ${rejectedLength} file(s).`, 404, ERR.OBJECT_NOT_FOUND, ...rejectedImages)
  }
}