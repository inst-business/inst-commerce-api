import { Schema, Document, model, ObjectId } from 'mongoose'
import { SuspendableModel } from './Model'
// import withJsonSchema from 'mongoose-schema-jsonschema'
import {
  GV, ExcludableKeys, GENDER, USER_ROLE, ACCOUNT_STATUS, FLAG, IResultWithPars
} from '@/config/global/const'
import {
  TSuspendableDocument, withSoftDelete, handleQuery, ISoftDeleted
} from '@/utils/mongoose'

export interface IUser extends ISoftDeleted {
  _id: ObjectId
  username: string
  email: string
  tel: string
  password: string
  salt: string
  firstname: string
  lastname: string
  gender: GENDER
  birthday?: Date
  address?: string
  country?: string
  bio?: string
  avatar?: string
  cover?: string
  role: USER_ROLE
  status: ACCOUNT_STATUS
  // tier: ROLE['USER']
  // token?: string
  flag?: {
    tier: FLAG
    // reason: string
    flaggedBy: ObjectId
    flaggedAt: Date
  }
  verifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TUserDocument = IUser & Document

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 32 },
  email: { type: String, required: true, unique: true, maxlength: 24 },
  tel: { type: String, required: true, unique: true, maxlength: 24 },
  password: { type: String, required: true },
  salt: { type: String, required: true, maxlength: GV.SALT_LENGTH },
  firstname: { type: String, required: true, minlength: 1, maxlength: 32 },
  lastname: { type: String, required: true, minlength: 1, maxlength: 32 },
  gender: { type: Number, required: true, enum: GENDER },
  birthday: { type: Date, default: null },
  address: { type: String, maxlength: 255, default: '' },
  country: { type: String, minlength: 2, maxlength: 48, default: '' },
  bio: { type: String, maxlength: 255, default: '' },
  avatar: { type: String, default: '' },
  cover: { type: String, default: '' },
  role: { type: Number, required: true, enum: USER_ROLE, default: USER_ROLE.NORMAL },
  status: { type: Number, required: true, enum: ACCOUNT_STATUS, default: ACCOUNT_STATUS.PENDING },
  // token: { type: String, default: '' },
  flag: {
    tier: { type: Number, required: true, enum: FLAG },
    flaggedBy: { type: Schema.Types.ObjectId, required: true, ref: 'UserAdmin' },
    flaggedAt: { type: Date },
  },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true })

// withJsonSchema(mongoose)
// const UserJSONSchema = (<any>UserSchema).jsonSchema()
// export { UserJSONSchema as UserSchema }

withSoftDelete(UserSchema)

export const UserModel = model<IUser, TSuspendableDocument<IUser>>('User', UserSchema)


class User extends SuspendableModel<IUser> {

  constructor () {
    super(UserModel)
  }

  async getUserByUsername (username: string, selected?: ExcludableKeys<IUser>[]): Promise<IUser | null> {
    const q = this.Model.findOne({ username }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data
  }

  async getUserByEmailOrUsername (email: string, username: string, selected?: ExcludableKeys<IUser>[]): Promise<IUser | null> {
    const q = this.Model.findOne({
      $or: [{ username }, { email }]
    }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data
  }

  async getAuthorizedUserByUsername (username: string, role: USER_ROLE, selected?: ExcludableKeys<IUser>[]): Promise<IUser | null> {
    const q = this.Model.findOne({ username, role: { $in: role } }).select(selected?.join(' ') ?? '').lean()
    const data = await handleQuery(q)
    return data
  }

  async checkUserExists (email: string, username: string): Promise<IResultWithPars> {
    const qEmail = this.Model.where({ email }).countDocuments(),
          qUsername = this.Model.where({ username }).countDocuments()
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
    const q = this.Model.where({
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
    const q = this.Model.findOneAndUpdate({ username }, update)
    const res = await handleQuery(q)
    return res ? true : false
  }

  async insertNewUser (user: IUser): Promise<IUser> {
    const q = this.Model.create(user)
    const res = await handleQuery(q)
    return res
  }
  
}

export default User