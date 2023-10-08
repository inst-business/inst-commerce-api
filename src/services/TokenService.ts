import jwt from 'jsonwebtoken'
import Auth from '@/app/middlewares/Authenticate'
import _ from '@/utils/utils'
import ERR from '@/config/global/error'

class Token {

  static useAccessToken () {
    return _.routeNextableAsync(async (req, res, next) => {
      const accessToken = req.cookies.accessToken
      // console.log('cookies: ', req.cookies)
      if (accessToken) {
        req.headers.authorization = `Bearer ${accessToken}`
      }
      next()
    })
  }

  static requireToken () {
    return _.routeNextableAsync(async (req, res, next) => {
      try {
        Auth.reqUser()
      }
      catch (err) {
        console.log(err)
      }
      next()
    })
  }
  
  static verify (token: string) {
    let res
    jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, payload) => {
      if (err) {
        throw _.logicError('Session Expired', 'Your session has expired.', 401, ERR.REQUEST_EXPIRED)
      }
    })
  }

  
  static setAccessToken (accessToken: string) {
    if (accessToken == null) return
    localStorage.setItem('accessToken', accessToken)
  }

  static getRefreshToken (): string {
    return localStorage.refreshToken
  }

  // static setRefreshToken (refreshToken: string) {
  //   if (refreshToken == null) return
  //   localStorage.setItem('accessToken', refreshToken)
  // }

  static clear () {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export default Token