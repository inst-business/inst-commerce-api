import mongoose, { Schema, model } from 'mongoose'
// import withJsonSchema from 'mongoose-schema-jsonschema'
import { GV, GENDER, ACCOUNT_STATUS, ACCOUNT_ROLE } from '@/config/global/const'
import { TSuspendableDocument, withSoftDeletePlugin } from '@/utils/mongoose'

export interface IUser {
  username: string,
  email: string,
  tel: string,
  password: string,
  firstname: string,
  lastname: string,
  gender: GENDER,
  birthday?: Date,
  address?: string;
  country?: string;
  bio?: string,
  avatar?: string,
  cover?: string,
  status: ACCOUNT_STATUS,
  role: ACCOUNT_ROLE,
  token?: string,
  salt: string,
  verifiedAt?: Date,
  createdAt?: Date,
  updatedAt?: Date,
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, lowercase: true, maxLength: 32 },
  email: { type: String, required: true, unique: true, maxLength: 50 },
  tel: { type: String, required: true, unique: true, maxLength: 20 },
  password: { type: String, required: true },
  firstname: { type: String, required: true, maxLength: 50 },
  lastname: { type: String, required: true, maxLength: 50 },
  gender: { type: String, required: true, default: 'other'},
  birthday: { type: Date, default: null },
  address: { type: String, maxLength: 128, default: '' },
  country: { type: String, maxLength: 32, default: '' },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  cover: { type: String, default: '' },
  status: { type: String, required: true, default: 'pending' },
  role: { type: String, required: true, default: 'customer' },
  token: { type: String, default: '' },
  salt: { type: String, required: true, maxLength: GV.SALT_LENGTH },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true })

// withJsonSchema(mongoose)
// const UserJSONSchema = (<any>UserSchema).jsonSchema()

withSoftDeletePlugin(UserSchema)
const User = model<IUser, TSuspendableDocument<IUser>>('User', UserSchema)

export {
  // UserJSONSchema as UserSchema
}
export default User