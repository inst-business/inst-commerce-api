import jwt from 'jsonwebtoken'
import UserModel, { IUser } from '@models/User'
import _ from '@/utils/utils'
import { GV, USER_STATUS_ARR, USER_SIGN } from '@/config/global/const'
import ERR from '@/config/global/error'

const User = new UserModel()

class AuthCtrl {

  // static saltHashPassword(userpassword: string): Object {
  //   const salt = _.genRandomString(GV.SALT_LENGTH)
  //   const passwordData = _.sha512(userpassword, salt)
  //   return passwordData
  // }

  static authenticateUser () {
    return _.routeAsync(async (req, res) => {
      const
        errTitle = 'Login Failed',
        { userInfo, password } = req.body,
        user = await User.getUserByEmailOrUsername(userInfo, userInfo)
      if (user != null) {
        if (user.status === USER_STATUS_ARR[1] || !user.verifiedAt) {
          throw _.logicError(errTitle, 'User is not verified.', 401, ERR.UNVERIFIED, userInfo)
        }
        if (!_.compareBcryptHash(password, user.salt, user.password)) {
          throw _.logicError(errTitle, 'Password is not correct.', 400, ERR.INVALID_PASSWORD)
        }
        const
          { username, email, tel, firstname, lastname, avatar } = user,
          userSign = { username, email, tel, name: { firstname, lastname }, avatar } satisfies USER_SIGN,
          accessToken = _.genAccessToken(userSign),
          refreshToken = _.genRefreshToken(userSign)
        return { accessToken, refreshToken }
      }
      else {
        throw _.logicError(errTitle, 'User information does not exist.', 400, ERR.USER_NOT_EXIST, userInfo)
      }
    })
  }
  
  static createNewUser () {
    return _.routeAsync(async (req, res) => {
      const { email, username } = req.body
      const isExisting = await User.checkUserExists(email, username)
      if (isExisting.result) {
        throw _.logicError('Signup Failed', 'User already exists', 400, ERR.USER_ALREADY_EXIST, <any>isExisting.pars)
      }
      const keys = [
        'email', 'username', 'password', 'tel',
        'firstname', 'lastname', 'gender', 'birthday',
        'address', 'country', 'bio', 'avatar', 'cover',
      ],
      data = _.pickProps(<IUser>req.body, keys)
      data.salt = _.genRandomString(GV.SALT_LENGTH)
      // data.password = _.sha512(data.password, data.salt)
      data.password = _.genBcryptHash(data.password, data.salt)
      const newUser = await User.insertNewUser(data)
      const verifyToken = _.genVerifyToken(newUser.username)
      res.status(201)
      return { username: newUser.username, verifyToken }
    }
  )}

  static verifyUser () {
    return _.routeAsync(async (req, res) => {
      const
        errTitle = 'Rejected',
        { username } = req.body,
        isVerified = await User.checkUserVerified(username)
      if (isVerified) {
        throw isVerified && _.logicError(errTitle, 'User is verified.', 400, ERR.ALREADY_VERIFIED, username)
      }
      const { token } = req.query
      if (token == null || token === '') {
        throw _.logicError(errTitle, 'Invalid verify token.', 400, ERR.INVALID_DATA, <string>token)
      }
      const secretKey = _.genHash(username + <string>_.env('ACCESS_TOKEN'))
      return jwt.verify(<string>token, secretKey, async err => {
        if (err) {
          throw _.logicError(errTitle, 'Token is invalid or has expired.', 400, ERR.REQUEST_EXPIRED, <string>token)
        }
        const verifyUser = await User.verifyUser(username)
        if (!verifyUser) {
          throw _.logicError(errTitle, 'User is verified.', 400, ERR.ALREADY_VERIFIED, username)
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
          throw _.logicError('Rejected', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
        }
        const verifyToken = _.genVerifyToken(username)
        return { verifyToken }
      }
      else {
        throw _.logicError('Not Found', 'User does not exist', 400, ERR.USER_NOT_EXIST, username)
      }
    }
  )}
  
  static authenticateAdmin () {
    return _.routeAsync(async (req, res) => {
      const
        errTitle = 'Login Failed',
        { userInfo, password } = req.body,
        user = await User.getUserByEmailOrUsername(userInfo, userInfo)
      if (user != null) {
        if (user.status === USER_STATUS_ARR[1] || !user.verifiedAt) {
          throw _.logicError(errTitle, 'User is not verified.', 401, ERR.UNVERIFIED, userInfo)
        }
        if (!_.compareBcryptHash(password, user.salt, user.password)) {
          throw _.logicError(errTitle, 'Password is not correct.', 400, ERR.INVALID_PASSWORD)
        }
        const
          { username, email, tel, firstname, lastname, avatar } = user,
          userSign = { username, email, tel, name: { firstname, lastname }, avatar } satisfies USER_SIGN,
          accessToken = _.genAccessToken(userSign),
          refreshToken = _.genRefreshToken(userSign)
        return { accessToken, refreshToken }
      }
      else {
        throw _.logicError(errTitle, 'User information does not exist.', 400, ERR.USER_NOT_EXIST, userInfo)
      }
    })
  }
  
}

export default AuthCtrl