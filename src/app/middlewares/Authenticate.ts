import express, { RequestHandler } from 'express'
import 'dotenv/config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import UserModel from '@models/User'
import _ from '@/utils/utils'
import { GV, R, ACCOUNT_STATUS, ACCOUNT_STATUS_ARR } from '@/config/global/const'
import ERR from '@/config/global/error'

const User = new UserModel()

class Auth {

  static authUser (): RequestHandler {
    return _.routeAsync(async (req, res) => {
      const { userInfo, password } = req.body
      const user = await User.getUserByEmailOrUsername(userInfo, userInfo)
      if (!_.isEmpty(user)) {
        if (user.status === ACCOUNT_STATUS_ARR.PENDING || !user.verifiedAt) {
          throw _.logicError('ERROR', 'User is not verified', 400, ERR.UNVERIFIED, userInfo)
        }
        if (user.password !== _.sha512(password, user.salt)) {
          throw _.logicError('Login failed', 'Password is not correct', 400, ERR.INVALID_PASSWORD, _.sha512(password, user.salt))
        }
        const
          { username, email, firstname, lastname } = user,
          userSign = { username, email, name: { firstname, lastname } },
          accessToken = _.genAccessToken(userSign),
          refreshToken = _.genRefreshToken(userSign)
        return { accessToken, refreshToken }
      }
      else {
        throw _.logicError('Login failed', 'Invalid information', 400, ERR.USER_NOT_EXIST, userInfo)
      }
    })
  }

  static absoluteDeny (): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      throw _.logicError('Forbidden', 'You don\'t have permission.', 403, ERR.FORBIDDEN)
      // next()
    })
  }
  
  static reqUser (): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      if (_.isEmpty(token) || !token) {
        throw _.logicError('Error', 'Unauthorized', 401, ERR.UNAUTHORIZED)
      }
      jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, user) => {
        if (err) {
          throw _.logicError('Expired', 'Request has expired.', 401, ERR.REQUEST_EXPIRED)
        }
        // (<any>req).user = user
        Object.assign(req, { user })
        next()
      })
      // next()
    },
      _.redirectView('/v1/login')
    )
  }

  static reqStatus (): RequestHandler {
    return  _.routeNextableAsync(async (req, res, next) => {
      // const authHeader = req.headers.authorization
      // const token = authHeader && authHeader.split(' ')[1]
      // if (_.isEmpty(token) || !token) {
      //   throw _.logicError('Error', 'Unauthorized', 401, ERR.UNAUTHORIZED)
      // }
      // jwt.verify(token, <string>process.env.ACCESS_TOKEN, (err, user) => {
      //   if (err) {
      //     throw _.logicError('Expired', 'Request has expired', 401, ERR.REQUEST_EXPIRED)
      //   }
      //   (<any>req).user = user
      //   next()
      // })
      next()
    })
  }

}

export default Auth