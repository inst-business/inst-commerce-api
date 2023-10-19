import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { GV } from '@/config/global/const'

export interface IWishlist {
  _id: ObjectId
  user: ObjectId
  products: ObjectId[]
  createdAt: Date
  updatedAt: Date
  editedAt?: Date
}

type TWishlistDocument = IWishlist & Document