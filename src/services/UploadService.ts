import path from 'path'
import multer from 'multer'
import sharp from 'sharp'
import {
  ENV, GV, Many, TProps, PropsKey, RecursiveArray, Primitives, ErrPars
} from '@/config/global/const'
import ERR from '@/config/global/error'

export const upload = () => {
  const uploadPath = path.join('../upload')
  return multer({
  })
}