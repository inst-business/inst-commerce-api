import { Schema, Document, model, ObjectId } from 'mongoose'
// import { SuspendableModel } from './Model'
// import withJsonSchema from 'mongoose-schema-jsonschema'
import {
  ExcludableKeys, GV, STATUS, STATUS_ARR, ROLE, ROLE_ARR, ALL_RULES, IResultWithPars
} from '@/config/global/const'
import {
  TSuspendableDocument, withSoftDelete, handleQuery
} from '@/utils/mongoose'

export interface IUserAdmin {
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
  verifiedAt?: Date
  user: ObjectId
  createdAt?: Date
  updatedAt?: Date
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

// withJsonSchema(mongoose)
// const UserAdminJSONSchema = (<any>UserAdminSchema).jsonSchema()
// export { UserAdminJSONSchema as UserAdminSchema }

// withSoftDelete(UserAdminSchema, 'UserAdmin')
export const UserAdmin = model<IUserAdmin, TSuspendableDocument<IUserAdmin>>('UserAdmin', UserAdminSchema)


class UserAdminModel {

}

export default UserAdminModel