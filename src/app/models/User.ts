import { Schema, Document, model, ObjectId } from 'mongoose'
// import { SuspendableModel } from './Model'
// import withJsonSchema from 'mongoose-schema-jsonschema'
import {
  ExcludableKeys, GV, GENDER, ACCOUNT_STATUS, ROLE, ROLES, ALL_RULES, IResultWithPars
} from '@/config/global/const'
import {
  TSuspendableDocument, withSoftDelete, handleQuery
} from '@/utils/mongoose'

export interface IUser extends Document {
  _id: ObjectId
  username: string
  email: string
  tel: string
  password: string
  firstname: string
  lastname: string
  gender: GENDER
  birthday?: Date
  address?: string
  country?: string
  bio?: string
  avatar?: string
  cover?: string
  status: ACCOUNT_STATUS
  role: ROLE
  permissions: ALL_RULES[]
  token?: string
  salt: string
  verifiedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

type TUserDocument = IUser & Document

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, lowercase: true, minlength: 3, maxlength: 32 },
  email: { type: String, required: true, unique: true, maxlength: 24 },
  tel: { type: String, required: true, unique: true, maxlength: 24 },
  password: { type: String, required: true },
  firstname: { type: String, required: true, minlength: 1, maxlength: 32 },
  lastname: { type: String, required: true, minlength: 1, maxlength: 32 },
  gender: { type: String, required: true, default: 'other'},
  birthday: { type: Date, default: null },
  address: { type: String, maxlength: 128, default: '' },
  country: { type: String, minlength: 1, maxlength: 48, default: '' },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  cover: { type: String, default: '' },
  status: { type: String, required: true, default: 'pending' },
  role: { type: String, required: true, default: 'user' },
  permissions: { type: [String], default: [] },
  token: { type: String, default: '' },
  salt: { type: String, required: true, maxlength: GV.SALT_LENGTH },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true })

// withJsonSchema(mongoose)
// const UserJSONSchema = (<any>UserSchema).jsonSchema()
// export { UserJSONSchema as UserSchema }

// withSoftDelete(UserSchema, 'User')
export const User = model<IUser, TSuspendableDocument<IUser>>('User', UserSchema)


class UserModel {

  async getUserByUsername (username: string, selected?: ExcludableKeys<IUser>[]): Promise<IUser | null> {
    const q = User.findOne({ username }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data
  }

  async getUserByEmailOrUsername (email: string, username: string, selected?: ExcludableKeys<IUser>[]): Promise<IUser | null> {
    const q = User.findOne({
      $or: [{ username }, { email }]
    }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data
  }

  async getAuthorizedUserByUsername (username: string, roles: ROLE[], selected?: ExcludableKeys<IUser>[]): Promise<IUser | null> {
    const q = User.findOne({ username, role: { $in: roles } }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data
  }

  async checkUserExists (email: string, username: string): Promise<IResultWithPars> {
    const qEmail = User.where({ email }).countDocuments(),
          qUsername = User.where({ username }).countDocuments()
    const isEmailExists = await handleQuery(qEmail),
          isUsernameExists = await handleQuery(qUsername),
          result = isEmailExists > 0 || isUsernameExists > 0
    const data = {
      result,
      ...(result && {
        pars: [
          ...isEmailExists > 0 ? [email] : [],
          ...isUsernameExists > 0 ? [username] : [],
        ]
      }),
    }
    return data
  }

  async checkUserVerified (username: string): Promise<boolean> {
    const q = User.where({
      username,
      status: { $nin: [ 'pending' ] },
      verifiedAt: { $exists: true, $nin: [ null ] }
    }).countDocuments()
    const data = await handleQuery(q)
    return data > 0 ? true : false
  }

  async verifyUser (username: string): Promise<boolean> {
    const update = {
      status: 'active',
      verifiedAt: Date.now()
    }
    const q = User.findOneAndUpdate({ username }, update)
    const res = await handleQuery(q)
    return res ? true : false
  }

  async insertNewUser (user: IUser): Promise<IUser> {
    // const formData = structuredClone(user)
    const q = User.create(user)
    const res = await handleQuery(q)
    return res
  }
  
}

export default UserModel