import { Request } from 'express'
import path from 'path'
import multer, { diskStorage, MulterError } from 'multer'
import sharp from 'sharp'
import _ from '@/utils/utils'
import LogicError from '@/utils/logicError'
import { GV } from '@/config/global/const'
import ERR from '@/config/global/error'


const uploadImage = (dest: string, prefix: string, maxSize?: number) =>
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
    // dest: path.join('../upload'),
    storage: diskStorage({
      destination: path.join('public/uploads', dest),
      filename: function (req, file, cb) {
        const name = _.genSlug(_.genUniqueCode(prefix) + '-' + req.body.name)
        const ext = path.extname(file.originalname)
        cb(null, name + ext)
      }
    })
  })

const handleMulterError = (err: MulterError | LogicError, req: Request) => {
  if (err instanceof MulterError) {
    const errMsg = 'Service has been crashed unexpectedly, please try again later.';
    (<any>req).errorUpload = _.logicError('Upload Fail', errMsg, 500, ERR.SERVICE_ERROR)
    return
  }
  (<any>req).errorUpload = err
}

export const uploadOneImage = (fieldName: string, dest: string, prefix: string, maxSize?: number) =>
  _.routeNextableAsync(async (req, res, next) => {
    uploadImage(dest, prefix, maxSize).single(fieldName)(req, res, (err) => {
      if (err) return handleMulterError(err, req)
    })
    next()
  })