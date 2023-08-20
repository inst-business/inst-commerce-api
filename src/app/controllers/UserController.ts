import User, { IUser } from '@models/User'
import { GV, IResultWithPars } from '@/config/global/const'
import _ from '@/utils/utils'
import { handleQuery, mongoError } from '@/utils/mongoose'
import ERR from '@/config/global/error'

class UserController {

  static saltHashPassword(userpassword: string): Object {
    const salt = _.genRandomString(GV.SALT_LENGTH)
    const passwordData = _.sha512(userpassword, salt)
    return passwordData
  }

  static async getUserByEmailOrUsername (email: string, username: string): Promise<IUser | null> {
    const query = User.findOne({
      $or: [{ username: username }, { email: email }]
    }).lean()
    const data = await query
    return data
  }

  static async checkUserExists (email: string, username: string): Promise<IResultWithPars> {
    const queryEmail = User.where({ email }).countDocuments(),
          queryUsername = User.where({ username }).countDocuments()
    const isEmailExists = await queryEmail,
          isUsernameExists = await queryUsername,
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
    const query = User.where({
      username,
      status: { $nin: [ 'pending' ] },
      verifiedAt: { $exists: true, $nin: [ null ] }
    }).countDocuments()
    const data = await query
    return data > 0 ? true : false
  }

  static async verifyUser (username: string): Promise<boolean> {
    const update = {
      status: 'active',
      verifiedAt: Date.now()
    }
    const query = User.findOneAndUpdate({ username }, update)
    const res = await query
    return res ? true : false
  }

  static async insertNewUser (user: IUser): Promise<IUser> {
    // const formData = structuredClone(user)
    const query = User.create(user)
    const res = await handleQuery<IUser>(query)
    return res
  }
  
}

export default UserController