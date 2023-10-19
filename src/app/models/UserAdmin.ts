import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  ExcludableKeys, GV, STATUS, STATUS_ARR, ROLE, ROLE_ARR, ALL_RULES, IResultWithPars
} from '@/config/global/const'
import {
  TSuspendableDocument, handleQuery, ISoftDeleted, withSoftDelete
} from '@/utils/mongoose'

export interface IUserAdmin extends ISoftDeleted {
  _id: ObjectId
  email: string
  tel: string
  password: string
  salt: string
  bio?: string
  avatar?: string
  cover?: string
  status: STATUS['ACCOUNT']
  role: ROLE['ADMIN']
  permissions?: ALL_RULES[]
  user: ObjectId
  verifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TUserAdminDocument = IUserAdmin & Document

const UserAdminSchema = new Schema<IUserAdmin>({
  email: { type: String, required: true, unique: true, maxlength: 24 },
  tel: { type: String, required: true, unique: true, maxlength: 24 },
  password: { type: String, required: true },
  salt: { type: String, required: true, maxlength: GV.SALT_LENGTH },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  cover: { type: String, default: '' },
  status: { type: String, required: true, enum: STATUS_ARR.ACCOUNT, default: 'pending' },
  role: { type: String, required: true, enum: ROLE_ARR.ADMIN, default: 'moderator' },
  permissions: { type: [String] },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true })

withSoftDelete(UserAdminSchema, 'UserAdmin')
export const UserAdminModel = model<IUserAdmin, TSuspendableDocument<IUserAdmin>>('UserAdmin', UserAdminSchema)


class UserAdmin extends SuspendableModel<IUserAdmin> {

}

export default UserAdmin