import path from 'path'
import multer, { Multer } from 'multer'
import sharp from 'sharp'
import {
  ENV, GV, Many, TProps, PropsKey, RecursiveArray, Primitives, ErrPars
} from '@/config/global/const'
import ERR from '@/config/global/error'

export const upload = multer({
  dest: path.join('../upload'),
}).none()