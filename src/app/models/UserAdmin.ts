import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
import {
  TSuspendableDocument, handleQuery, ISoftDeleted, withSoftDelete
} from '@/utils/mongoose'
import {
  GV, ExcludableKeys, ACCOUNT_STATUS, ADMIN_ROLE, ALL_RULES, IResultWithPars
} from '@/config/global/const'

export interface IUserAdmin extends ISoftDeleted {
  _id: ObjectId
  email: string
  tel: string
  password: string
  salt: string
  bio?: string
  avatar?: string
  cover?: string
  status: ACCOUNT_STATUS
  role: ADMIN_ROLE
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
  status: { type: Number, required: true, enum: ACCOUNT_STATUS, default: ACCOUNT_STATUS.PENDING },
  role: { type: Number, required: true, enum: ADMIN_ROLE, default: ADMIN_ROLE.MODERATOR },
  permissions: { type: [String] },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true })

withSoftDelete(UserAdminSchema, 'UserAdmin')

export const UserAdminModel = model<IUserAdmin, TSuspendableDocument<IUserAdmin>>('UserAdmin', UserAdminSchema)


class UserAdmin extends SuspendableModel<IUserAdmin> {

  constructor () {
    super(UserAdminModel)
  }

}

export default UserAdmin