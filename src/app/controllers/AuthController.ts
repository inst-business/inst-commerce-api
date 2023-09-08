import jwt from 'jsonwebtoken'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { GV, ACCOUNT_STATUS_ARR, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const User = new UserModel()

class AuthCtrl {

  static saltHashPassword(userpassword: string): Object {
    const salt = _.genRandomString(GV.SALT_LENGTH)
    const passwordData = _.sha512(userpassword, salt)
    return passwordData
  }

  static authenticateUser () {
    return _.routeAsync(async (req, res) => {
      const { userInfo, password } = req.body
      const user = await User.getUserByEmailOrUsername(userInfo, userInfo)
      if (user != null) {
        if (user.status === ACCOUNT_STATUS_ARR.PENDING || !user.verifiedAt) {
          throw _.logicError('ERROR', 'User is not verified', 400, ERR.UNVERIFIED, userInfo)
        }
        if (user.password !== _.sha512(password, user.salt)) {
          throw _.logicError('Login failed', 'Password is not correct', 400, ERR.INVALID_PASSWORD)
        }
        const
          { username, email, tel, firstname, lastname, role, permissions } = user,
          userSign: USER_SIGN = {
            username, email, tel, name: { firstname, lastname }, role, permissions
          },
          accessToken = _.genAccessToken(userSign),
          refreshToken = _.genRefreshToken(userSign)
        return { accessToken, refreshToken }
      }
      else {
        throw _.logicError('Login failed', 'User information does not exist', 400, ERR.USER_NOT_EXIST, userInfo)
      }
    })
  }
  
  static createNewUser () {
    return _.routeAsync(async (req, res) => {
      const { email, username } = req.body
      const isExisting = await User.checkUserExists(email, username)
      if (!isExisting.result) {
        const keys = [
          'email', 'username', 'password', 'tel',
          'firstname', 'lastname', 'gender', 'birthday',
          'address', 'country', 'bio', 'avatar', 'cover',
        ],
        data = _.pickProps(<IUser>req.body, keys)
        data.salt = _.genRandomString(GV.SALT_LENGTH)
        data.password = _.sha512(data.password, data.salt)
        const newUser = await User.insertNewUser(data)
        const verifyToken = _.genVerifyToken(newUser.username)
        return { username: newUser.username, verifyToken }
      }
      else {
        throw _.logicError('Signup failed', 'User already exists', 400, ERR.USER_ALREADY_EXIST, <any>isExisting.pars)
      }
    },
    _.redirectView('/v1/categories/d')
  )}

  static verifyUser () {
    return _.routeAsync(async (req, res) => {
      const { username } = req.body
      const isVerified = await User.checkUserVerified(username)
      if (isVerified) {
        throw isVerified && _.logicError('Verified', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
      }
      const { token } = req.query
      if (token == null || token === '') {
        throw _.logicError('Invalid', 'Invalid verify token', 400, ERR.INVALID_DATA, <string>token)
      }
      const secretKey = _.genHash(username + <string>process.env.ACCESS_TOKEN)
      return jwt.verify(<string>token, secretKey, async err => {
        if (err) {
          throw _.logicError('Expired', 'Token has expired', 400, ERR.REQUEST_EXPIRED, <string>token)
        }
        const verifyUser = await User.verifyUser(username)
        if (!verifyUser) {
          throw _.logicError('Verified', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
        }
        return verifyUser
      })
    },
  )}

  static createVerifyToken () {
    return _.routeAsync(async (req, res) => {
      const { username } = req.body
      const isExisting = await User.checkUserExists(username, username)
      if (isExisting.result) {
        const isVerified = await User.checkUserVerified(username)
        if (isVerified) {
          throw _.logicError('Verified', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
        }
        const verifyToken = _.genVerifyToken(username)
        return { verifyToken }
      }
      else {
        throw _.logicError('Not found', 'User does not exist', 400, ERR.USER_NOT_EXIST, username)
      }
    }
  )}
  
}

export default AuthCtrl