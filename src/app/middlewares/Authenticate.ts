import express from 'express'
import 'dotenv/config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import _ from '@/utils/utils'
import { GV, ROUTES, ACCOUNT_STATUS, ACCOUNT_STATUS_ARR } from '@/config/global/const'
import ERR from '@/config/global/error'

class Auth {
  
  static authToken (): express.RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      if (_.isEmpty(token) || !token) {
        throw _.logicError('Error', 'Unauthorized', 401, ERR.UNAUTHORIZED)
      }
      jwt.verify(token, <string>process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
          throw _.logicError('Expired', 'Request has expired', 401, ERR.REQUEST_EXPIRED)
        }
        (<any>req).user = user
        next()
      })
      // next()
    })
  }

  static authStatus (): express.RequestHandler {
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