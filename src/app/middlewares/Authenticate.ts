import 'dotenv/config'
import express, { RequestHandler } from 'express'
import url from 'url'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import UserModel from '@models/User'
import _ from '@/utils/utils'
import {
  GV, ROLE, ROLE_ARR, ALL_RULES, RULE, USER_SIGN
} from '@/config/global/const'
import ERR from '@/config/global/error'

const User = new UserModel()

class Auth {

  static absoluteDeny (): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      throw _.logicError('Forbidden', 'You do not have permission.', 403, ERR.FORBIDDEN)
      // next()
    })
  }
  
  static reqUser (): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null || token === '') {
        throw _.logicError('Unauthorized', 'You are not allowed.', 401, ERR.UNAUTHORIZED)
      }
      jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, user) => {
        if (err) {
          throw _.logicError('Session Expired', 'Your session has expired.', 401, ERR.REQUEST_EXPIRED)
        }
        // Object.assign(req, { user })
        (<any>req).user = user
        next()
      })
    })
  }

  static reqRole (role: ROLE): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      // const user: USER_SIGN = (<any>req).user
      // if (user.role !== role) {
      //   throw _.logicError('Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      // }
      next()
    })
  }

  static reqUserByRole (role: ROLE['USER']): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null || token === '') {
        throw _.logicError('Unauthorized', 'You are not allowed.', 401, ERR.UNAUTHORIZED)
      }
      jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, user) => {
        if (err) {
          throw _.logicError('Session Expired', 'Your session has expired.', 401, ERR.REQUEST_EXPIRED)
        }
        if (role !== (<USER_SIGN>user).role) {
          throw _.logicError('Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
        }
        (<any>req).user = user
        next()
      })
      next()
    })
  }
  
  static reqSellerByRole (role: ROLE['SELLER']): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      // const authHeader = req.headers.authorization
      // const token = authHeader && authHeader.split(' ')[1]
      // if (token == null || token === '') {
      //   throw _.logicError('Unauthorized', 'You are not allowed.', 401, ERR.UNAUTHORIZED)
      // }
      // jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, user) => {
      //   if (err) {
      //     throw _.logicError('Session Expired', 'Your session has expired.', 401, ERR.REQUEST_EXPIRED)
      //   }
      //   if (role !== (<USER_SIGN>user).role) {
      //     throw _.logicError('Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      //   }
      //   (<any>req).user = user
      //   next()
      // })
      next()
    })
  }
  
  static reqRules (rules: ALL_RULES[]): RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      // const user: USER_SIGN = (<any>req).user
      // if (user == null) {
      //   throw _.logicError('Error', 'Unauthorized', 401, ERR.UNAUTHORIZED)
      // }
      // if (user.role !== role) {
      //   throw _.logicError('Denied', 'You do not have permission.', 403, ERR.FORBIDDEN)
      // }
      next()
    })
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