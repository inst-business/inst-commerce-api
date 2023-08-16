import User, { IUser } from '@models/User'
import { GV } from '@/config/global/const'
import _ from '@/utils/utils'

class UserController {

  static saltHashPassword(userpassword: string): Object {
    const salt = _.genRandomString(GV.SALT_LENGTH)
    const passwordData = _.sha512(userpassword, salt)
    return passwordData
  }

  static async getUserByEmailOrUsername(email: string, username: string): Promise<IUser | null> {
    const query = User.findOne({
      $or: [{ username: username }, { email: email }]
    }).lean()
    const data = await query
    return data
  }

  static async checkUserExist(email: string, username: string) {
    const query = User.exists({
      $or: [{ username: username }, { email: email }]
    })
    const data = await query
    return data
  }
  
}

export default UserController