import { Schema, model } from 'mongoose'
import { GV, GENDER, ACCOUNT_STATUS, ACCOUNT_ROLE } from '@/config/global/const'
import { TSoftDeleteQueryHelpers, withSoftDeletePlugin } from '@/utils/mongoose'

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
  password: { type: String, required: true, maxLength: 50 },
  firstname: { type: String, required: true, maxLength: 50 },
  lastname: { type: String, required: true, maxLength: 50 },
  gender: { type: String, required: true, default: 'other'},
  birthday: { type: Date },
  address: { type: String, maxLength: 128 },
  country: { type: String, maxLength: 64 },
  bio: { type: String },
  avatar: { type: String },
  cover: { type: String },
  status: { type: String, required: true, default: 'pending' },
  role: { type: String, required: true, default: 'customer' },
  token: { type: String },
  salt: { type: String, required: true, maxLength: GV.SALT_LENGTH },
  verifiedAt: { type: Date },
}, { timestamps: true })

withSoftDeletePlugin(UserSchema)

const User = model<IUser, TSoftDeleteQueryHelpers<IUser>>('User', UserSchema)

export default User