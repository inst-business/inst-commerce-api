import url from 'url'
import jwt from 'jsonwebtoken'
import Auth from '@/app/middlewares/Authenticate'
import _ from '@/utils/utils'
import ERR from '@/config/global/error'

class Token {

  static useAccessToken () {
    return _.routeNextableAsync(async (req, res, next) => {
      const accessToken = req.cookies.accessToken
      if (accessToken) {
        req.headers.authorization = `Bearer ${accessToken}`
      }
      next()
    })
  }

  static reqUserOrRedirect (redirectUrl: string) {
    return _.routeNextableAsync(async (req, res, next) => {
      const token: string = req.cookies.accessToken
      const redirectParam = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
      })
      if (token == null || token === '') {
        res.cookie('alert', 'You need to login first.', { httpOnly: true })
        res.redirect(redirectUrl + '?redirect=' + redirectParam)
        return
      }
      jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, user) => {
        if (err) {
          res.cookie('alert', 'Your session has expired.', { httpOnly: true })
          res.clearCookie('accessToken')
          res.redirect(redirectUrl + '?redirect=' + redirectParam)
          return
        }
        next()
      })
    })
  }

  static reqUnauthorized (defaultUrl?: string) {
    return _.routeNextableAsync(async (req, res, next) => {
      const token: string = req.cookies.accessToken
      jwt.verify(token, <string>_.env('ACCESS_TOKEN'), (err, user) => {
        console.log(defaultUrl || '/')
        if (err == null) {
          res.redirect(defaultUrl || '/')
          return
        }
        next()
      })
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