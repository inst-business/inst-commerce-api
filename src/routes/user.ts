import express from 'express'
import UserController from '@controllers/UserController'
import { IUser } from '@models/User'
import Validate from '@middlewares/Validate'
import { GV, R, ACCOUNT_STATUS_ARR } from '@/config/global/const'
import UserValidator from '@/resources/validators/user'
import ERR from '@/config/global/error'
import _ from '@/utils/utils'
import jwt from 'jsonwebtoken'

const router = express.Router()


/** 
 *  EXTERNAL APIs
*/

router.post(R.EXT + R.AUTH.LOGIN,
  Validate.formData(UserValidator.login),
  _.routeAsync(async (req, res) => {
    const { userInfo, password } = req.body
    const user = await UserController.getUserByEmailOrUsername(userInfo, userInfo)
    
    if (!_.isEmpty(user)) {
      if (user.status === ACCOUNT_STATUS_ARR.PENDING || !user.verifiedAt) {
        throw _.logicError('ERROR', 'User is not verified', 400, ERR.UNVERIFIED, userInfo)
      }
      if (user.password !== _.sha512(password, user.salt)) {
        throw _.logicError('Login failed', 'Password is not correct', 400, ERR.INVALID_PASSWORD, _.sha512(password, user.salt))
      }
      const { username, email, firstname, lastname } = user,
            userSign = { username, email, name: { firstname, lastname } }
      const accessToken = _.genAccessToken(userSign),
            refreshToken = _.genRefreshToken(userSign)
      return { accessToken, refreshToken }
    }
    else {
      throw _.logicError('Login failed', 'Invalid information', 400, ERR.USER_NOT_EXIST, userInfo)
    }
  }
))


router.post(R.EXT + R.AUTH.SIGNUP,
  Validate.formData(UserValidator.signup),
  _.routeAsync(async (req, res) => {
    const { email, username } = req.body
    const isExisting = await UserController.checkUserExists(email, username)
    
    if (!isExisting.result) {
      const {
        password, firstname, lastname, gender, tel,
        birthday, address, country, bio, avatar, cover
      } = req.body
      const salt = _.genRandomString(GV.SALT_LENGTH),
            hashedPassword = _.sha512(password, salt)
      const data = <IUser>{
        email, username, password: hashedPassword, firstname, lastname,
        gender, tel, birthday, address, country, bio, avatar, cover, salt
      }
      const newUser = await UserController.insertNewUser(data)
      const verifyToken = _.genVerifyToken(newUser.username)
      return { username: newUser.username, verifyToken }
    }
    else {
      throw _.logicError('Signup failed', 'User already exist', 400, ERR.USER_ALREADY_EXIST, <any>isExisting.pars)
    }
  }
))


router.post(R.EXT + R.AUTH.VERIFY,
  _.routeAsync(async (req, res) => {
    const { username } = req.body
    const isVerified = await UserController.checkUserVerified(username)
    if (isVerified) {
      throw isVerified && _.logicError('Verified', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
    }
    const { token } = req.query
    if (_.isEmpty(token) || !token) {
      console.log(token)
      throw _.logicError('Invalid', 'Invalid verify token', 400, ERR.INVALID_DATA, <string>token)
    }
    const secretKey = _.genHash(username + <string>process.env.ACCESS_TOKEN)
    return jwt.verify(<string>token, secretKey, async err => {
      if (err) {
        throw _.logicError('Expired', 'Token has expired', 400, ERR.REQUEST_EXPIRED, <string>token)
      }
      const verifyUser = await UserController.verifyUser(username)
      if (!verifyUser) {
        throw _.logicError('Verified', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
      }
      return verifyUser
    })
  }
))


router.post(R.EXT + R.AUTH.GEN_VERIFY,
  _.routeAsync(async (req, res) => {
    const { username } = req.body
    const isExisting = await UserController.checkUserExists(username, username)
    if (isExisting.result) {
      const isVerified = await UserController.checkUserVerified(username)
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
))


/** 
 *  INTERNAL APIs
*/


export default router