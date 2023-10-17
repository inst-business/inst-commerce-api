import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import _ from '@/utils/utils'
import {
  ArgumentId, handleQuery, TSuspendableDocument, withEditedDetails, withSoftDelete
} from '@/utils/mongoose'
import { } from '@/config/global/const'

export interface IInventory {
  _id: ObjectId
  products: {
    id: ObjectId,
    specs: {
      sku: string
      qty: number
    }[]
  }
  reservations: {
    userId: ObjectId,
    qty: number
  }[]
  // qty: number
  createdAt: Date
  updatedAt: Date
  userModified?: ObjectId
  modifiedAt?: Date
  // isDeleted: boolean
  // userDeleted?: ObjectId
  // deletedAt?: Date
}

type TInventoryDocument = IInventory & Document