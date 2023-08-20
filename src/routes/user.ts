import express from 'express'
import UserController from '@controllers/UserController'
import { IUser } from '@models/User'
import { GV, ROUTES, ACCOUNT_STATUS, ACCOUNT_STATUS_ARR } from '@/config/global/const'
import ERR from '@/config/global/error'
import _ from '@/utils/utils'
import jwt from 'jsonwebtoken'

const router = express.Router()

/** 
 *  INTERNAL APIs
*/


/** 
 *  EXTERNAL APIs
*/
router.post(ROUTES.E.LOGIN, _.routeAsync(async (req, res) => {
  const { userInfo, password } = req.body
  // console.log(userInfo, password)
  const user: IUser | null = await UserController.getUserByEmailOrUsername(userInfo, userInfo)

  if (!_.isEmpty(user)) {
    // if (user.status === ACCOUNT_STATUS_ARR.PENDING) {
    //   throw _.logicError('ERROR', 'User is not verified', 400, ERR.UNVERIFIED, userInfo)
    // }
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
}))


router.post(ROUTES.E.SIGNUP, _.routeAsync(async (req, res) => {
  const { email, username } = req.body
  const isExisting = await UserController.checkUserExist(email, username)  
  if (!isExisting) {
    const {
      password, firstname, lastname, gender,
      tel, birthday, address, country, bio, avatar, cover, token
    } = req.body
    const salt = _.genRandomString(GV.SALT_LENGTH),
          hashedPassword = _.sha512(password, salt)
    const data = <IUser>{
      email, username, password: hashedPassword, firstname, lastname, gender,
      tel, birthday, address, country, bio, avatar, cover, token: '', salt
    }    
    const newUser = await UserController.insertNewUser(data)
    const verifyToken = _.genVerifyToken(newUser.username)
    return { newUser, verifyToken }
  }
  else {
    throw _.logicError('Signup failed', 'User already exist', 400, ERR.USER_ALREADY_EXIST, email)
  }
}))


router.post(ROUTES.E.GEN_VERIFY, _.routeAsync(async (req, res) => {
  const { username } = req.body
  const isExisting = await UserController.checkUserExist(username, username)
  if (isExisting) {
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
}))


router.post(ROUTES.E.VERIFY, _.routeAsync(async (req, res) => {
  const { token } = req.query
  const { username } = req.body
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
    console.log(verifyUser)
    if (!verifyUser) {
      throw _.logicError('Verified', 'User is verified', 400, ERR.ALREADY_VERIFIED, username)
    }
    return verifyUser
  })
}))

export default router