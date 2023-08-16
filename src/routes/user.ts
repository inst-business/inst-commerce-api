import express from 'express'
import UserController from '@controllers/UserController'
import { IUser } from '@models/User'
import { ROUTES, ACCOUNT_STATUS, ACCOUNT_STATUS_ARR } from '@/config/global/const'
import ERR from '@/config/global/error'
import _ from '@/utils/utils'

const router = express.Router()

/** 
 *  INTERNAL APIs
*/


/** 
 *  EXTERNAL APIs
*/
router.post(ROUTES.E.LOGIN, _.routeAsync(async (req, res) => {
  const { userInfo, password } = req.body
  const user: IUser | null = await UserController.getUserByEmailOrUsername(userInfo, userInfo)

  if (!_.isEmpty(user)) {
    if (user.status === ACCOUNT_STATUS_ARR.PENDING) {
      throw _.logicError('ERROR', 'User is not verified', 400, ERR.UNVERIFIED, userInfo)
    }
    if (user.password !== _.sha512(password, user.salt)) {
        throw _.logicError('ERROR', 'Password is not correct', 400, ERR.INVALID_PASSWORD, password);
    }
  }
  else {
    throw _.logicError('Login failed', 'Invalid information', 400, ERR.USER_NOT_EXIST, userInfo)
  }
}))

router.post(ROUTES.E.SIGNUP, _.routeAsync(async (req, res) => {
  const { email, username } = req.body
  const user = await UserController.checkUserExist(email, username)
  console.log(user)
  
  if (_.isEmpty(user)) {
    
  }
  else {
    throw _.logicError('Signup failed', 'User already exist', 400, ERR.USER_ALREADY_EXIST, email)
  }
}))

export default router