import User, { IUser } from '@models/User'
import { GV, IResultWithPars } from '@/config/global/const'
import _ from '@/utils/utils'
import { handleQuery } from '@/utils/mongoose'
import ERR from '@/config/global/error'

class UserController {

  static saltHashPassword(userpassword: string): Object {
    const salt = _.genRandomString(GV.SALT_LENGTH)
    const passwordData = _.sha512(userpassword, salt)
    return passwordData
  }

  static async getUserByEmailOrUsername (email: string, username: string): Promise<IUser | null> {
    const q = User.findOne({
      $or: [{ username: username }, { email: email }]
    }).lean()
    const data = await handleQuery(q)
    return data
  }

  static async checkUserExists (email: string, username: string): Promise<IResultWithPars> {
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

  static async checkUserVerified (username: string): Promise<boolean> {
    const q = User.where({
      username,
      status: { $nin: [ 'pending' ] },
      verifiedAt: { $exists: true, $nin: [ null ] }
    }).countDocuments()
    const data = await handleQuery(q)
    return data > 0 ? true : false
  }

  static async verifyUser (username: string): Promise<boolean> {
    const update = {
      status: 'active',
      verifiedAt: Date.now()
    }
    const q = User.findOneAndUpdate({ username }, update)
    const res = await handleQuery(q)
    return res ? true : false
  }

  static async insertNewUser (user: IUser): Promise<IUser> {
    // const formData = structuredClone(user)
    const q = User.create(user)
    const res = await handleQuery(q)
    return res
  }
  
}

export default UserController