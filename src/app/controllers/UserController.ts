import User, { IUser } from '@models/User'
import { GV } from '@/config/global/const'
import _ from '@/utils/utils'

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

  static async checkUserExist (email: string, username: string): Promise<boolean> {
    const query = User.where({
      $or: [{ username: username }, { email: email }]
    }).countDocuments()
    const data = await query
    return data > 0 ? true : false
  }

  static async checkUserVerified (username: string): Promise<boolean> {
    const query = User.where({
      username,
      verifiedAt: { $exists: true, $nin: [ null ] }
    }).countDocuments()
    const data = await query
    return data > 0 ? true : false
  }

  static async verifyUser (username: string): Promise<boolean> {
    const update = { verifiedAt: Date.now() }
    const query = User.findOneAndUpdate({ username }, update)
    const res = await query
    return res ? true : false
  }

  static async insertNewUser (user: IUser): Promise<IUser> {
    // const formData = structuredClone(user)
    const query = User.create(user)
    const res = await query
    return res
  }
  
}

export default UserController