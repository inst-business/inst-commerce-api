import {
  Request, Response, NextFunction, RequestHandler
} from 'express'
import path from 'path'
import _ from 'lodash'
import slugify from 'slugify'
import uniqueSlug from 'unique-slug'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import LogicError from './logicError'
import {
  ENV, GV, USER_SIGN, Many, TProps, PropsKey, RecursiveArray, Primitives, ErrPars
} from '@/config/global/const'
import ERR from '@/config/global/error'

export type ExpressAsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>
export type ExpressCallback = (data?: any, err?: any) => void
export type ExpressCallbackProvider = (res: Response, req?: Request) => ExpressCallback

class Utils {

  env (name: string, replacement?: Primitives) {
    if (ENV[name] == null) {
      if (replacement != null) return replacement
      const title = 'Internal Server Error'
      const message = 'An unexpected issue occurred.'
      console.error('Environment variable "%d" is missing.', name)
      throw this.logicError(title, message, 500, ERR.ENV_VARIABLE_MISSING)
    }
    return ENV[name]
  }

  async fetchAllSettled (records: Record<string, Promise<unknown>>) {
    const promises = Object.values(records)
    const keys = Object.keys(records)    
    const resData = await Promise.allSettled(promises).then(res => res)
    // const res = Object.fromEntries(
    //   resData.map((data, index) =>
    //     [keys[index], data.status === 'fulfilled' ? data.value : data.reason]
    //   )
    // )
    const res = resData.reduce((prev, cur, index) => 
      ({...prev, [keys[index]]: cur.status === 'fulfilled' ? cur.value : cur.reason}), {})
    return res
  }

  routeAsync (reqHandler: ExpressAsyncRequestHandler, callbackProvider?: ExpressCallbackProvider): RequestHandler {
    return (req, res, next) => {
      const cb = callbackProvider
        ? callbackProvider(res, req)
        : this.createServiceCallback(res)
      reqHandler(req, res, next)
        .then(data => cb(data))
        .catch(err => cb(null, err))
    }
  }

  routeNextableAsync (reqHandler: ExpressAsyncRequestHandler, callbackProvider?: ExpressCallbackProvider): RequestHandler {
    return (req, res, next) => {      
      const cb = callbackProvider
        ? callbackProvider(res, req)
        : this.createServiceCallback(res)
      reqHandler(req, res, next)
        .then(data => data && cb(data))
        .catch(err => cb(null, err))
    }
  }

  private createServiceCallback (res: Response): ExpressCallback {    
    return (data?: any, err?: any) => {
      // const resData = data ? JSON.parse(JSON.stringify(data)) : {}
      const resData = (data != null && typeof data === 'object') ? structuredClone(data) : {}
      res.statusCode = 200
      if (err) {
        console.error(err)
        const errJSON = typeof err.toJSON === 'function' ? err.toJSON() : err
        const errObj = (typeof errJSON === 'object')
          ? JSON.parse(JSON.stringify(errJSON)) : { message: err, code: -7 }
        const code = errObj.httpCode
        res.statusCode = (typeof code === 'number' && !isNaN(code)) ? code : 500
        resData['error'] = errObj
      }
      res.send(resData)
    }
  }

  renderView (view: string, view404 = false, layout?: string): ExpressCallbackProvider {
    return !GV.ALLOW_VIEW_ENGINE
      ? (res) => {
        try {
          throw this.logicError('Rejected', 'Rendering view has been refused', 406, ERR.RENDER_VIEW_REJECTED, view)
        } catch (e: any) {
          // this.errorMsg(e)
          console.warn('Rendering view rejected - ', view)
          return this.createServiceCallback(res)
        }
      }
      : (res: Response, req?: Request): ExpressCallback => {
        return (data: any, err?: any) => {
          const reception = {
            data,
            layout: layout || 'main.hbs',
            ...((req && (<any>req)?.user) && { sign: (<any>req).user }),
            // ...((referer && req?.headers.referer) && { referer: req.headers.referer }),
          }
          if (view404 && (data == null || data.length <= 0)) {
            res.render('app/notfound', { layout: 'no-partials' })
          }
          else res.render(view, reception)
        }
      }
  }

  redirectView (route: string, ...params: any[]): ExpressCallbackProvider {
    return !GV.ALLOW_VIEW_ENGINE
      ? (res) => {
        console.warn('Rendering view rejected.')
        return this.createServiceCallback(res)
      }
      : (res: Response, req?: Request): ExpressCallback => {
        return (data: any, err?: any) => {
          const args = params.reduce((prev, cur) => 
            (req?.params[cur]) ? [...prev, req.params[cur]] : prev
          , [])
          const url = this.routeParseParams(route, ...args)        
          res.redirect(url)
        }
      }
  }

  logicError (title: string, message: string, httpError: number, errorCode: number, ...pars: ErrPars): LogicError {
    return new LogicError(title, message, httpError, errorCode, ...pars)
  }

  stackError (title: string, message: string, httpError: number, errorCode: number, ...pars: ErrPars): LogicError {
    return this.logicError(title, message, httpError, errorCode, ...pars).withStack()
  }

  errorMsg (e: LogicError) {
    console.error(`${e.title}: ${e.message}\n`, `{http: ${e.httpCode}, error: ${e.errorCode}}\n`, e.pars)
  }
  
  routeParseParams (route: string, ...args: any[]): string {
    const regex = new RegExp(":\\w+")
    return args.reduce((prev, val) =>
      (_.isString(val) || _.isNumber(val) || val.constructor.name === 'ObjectId')
        ? prev.replace(regex, val?.toString()) : prev
    , route)
  }
  
  validate (schema: Record<string, unknown>) {
    const ajv = new Ajv()
    addFormats(ajv)
    return ajv.compile(schema)
  }

  // isType <T> (arg: any): arg is T {
  //   return (arg instanceof T)
  // }

  pickProps <T extends {}, K extends keyof T>
    (obj: T, ...keys: RecursiveArray<K | PropsKey>) {
      // better performance than Array.flat() but [depth = 1]
      // flattenKeys = (keys instanceof Array ? [].concat(...<[]>keys) : keys)
      const flattenKeys = (<K[]>keys).flat(Infinity)
      return Object.fromEntries(
        flattenKeys.filter(key => key in obj).map(key => [key, obj[<K>key]])
      ) as Pick<T, K>
    }
  
  inclusivePickProps <T extends {}, K extends PropsKey>
    (obj: T, ...keys: RecursiveArray<K>) {
      const flattenKeys = (<K[]>keys).flat(Infinity)
      return Object.fromEntries(
        flattenKeys.map(key => [key, obj[<keyof T>(<unknown>key)]])
      ) as {[key in K]: key extends keyof T ? T[key] : undefined}
    }
  
  omitProps <T extends {}, K extends keyof T>
    (obj: T, ...keys: RecursiveArray<K | PropsKey>) {
      const flattenKeys = (<K[]>keys).flat(Infinity)
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => !flattenKeys.includes(key as K))
      ) as Omit<T, K>
    }

  genAccessToken (user: any): string {
    const secretAccessToken = <string>this.env('ACCESS_TOKEN')
    const options = {
      expiresIn: GV.ACCESS_TOKEN_EXPIRED
    }
    return jwt.sign(user, secretAccessToken, options)
  }

  genRefreshToken (user: any): string {
    const secretRefreshToken = <string>this.env('REFRESH_TOKEN')
    return jwt.sign(user, secretRefreshToken)
  }

  genVerifyToken (username: string): string {
    const secretAccessToken = <string>this.env('ACCESS_TOKEN')
    const secretKey = this.genHash(username + secretAccessToken)
    const options = {
      expiresIn: GV.VERIFY_EXPIRED
    }
    return jwt.sign({username}, secretKey, options)
  }

  genSlug (content: string) {
    const options = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true, 
    }
    return slugify(content, options)
  }

  genUniqueSlug (title: string, code: string) {
    // const uniqueId = uniqueSlug(Date.now().toString())
    const uniqueId = uniqueSlug(code)
    return this.genSlug(title + '-' + uniqueId)
  }

  genUniqueCode (prefix = 'IA') {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    let uniqueCode = prefix.toUpperCase()

    const
      beginStr = timestamp.substring(0, 4),
      beginDigits = beginStr.split('').map(Number)
    for (let i = 0; i < beginDigits.length; i += 2) {
      const variant = (i + 1) * 2
      // e.g: 1694 -> {1+6+2}{9+4+6} -> 919
      const sum = (beginDigits[i] || 0) + (beginDigits[i + 1] || 0) + variant
      uniqueCode += sum.toString()
    }
    
    let restStr = timestamp.substring(4)
    restStr += (restStr.length % 2 !== 0) ? '0' : ''
    const
      numbers = restStr.match(/.{2}/g) || [],
      length = numbers.length,
      randomLettersString = this.genRandomLetters(length, 'upper'),
      letters = randomLettersString.match(/.{1}/g) || []
      
    for (let i = 0; i < length; i++) {
      const variant = (i + 1) * 2
      const n = (variant * Number(numbers[i])).toString().slice(-2)
      uniqueCode += letters[i] + n
    }
    
    return uniqueCode
  }

  genUniqueId () {
    return crypto.randomUUID()
  }

  genFileName (originalName: string, newName?: string, prefix = 'upload') {
    const ext = path.extname(originalName)
    const name = newName || path.basename(originalName, ext)
    return this.genSlug(this.genUniqueCode(prefix) + '-' + name) + ext
  }

  genHash (data: string) {
    // MD5 hashing algorithm
    return crypto.createHash('md5').update(data).digest('hex')
  }
  
  genRandomString (length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex').slice(0, length)
  }
  
  genRandomLetters (length: number, toCase?: 'upper' | 'lower'): string {
    let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (toCase != null && ['upper', 'lower'].includes(toCase))
      charset = toCase === 'lower' ? charset.toLowerCase() : charset
    else charset += charset.toLowerCase()
    const randomBytes = crypto.randomBytes(length)
    let randomLetterString = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytes[i] % charset.length
      randomLetterString += charset[randomIndex]
    }
    return randomLetterString
  }

  genSalt () {
  }

  sha512 (password: string, salt: string) {
    // sha512 hashing algorithm
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    const value: string = hash.digest('hex')
    // return {
    //   salt: salt,
    //   passwordHash: value
    // }
    return value
  }

}

// const utils: Utils & _.LoDashStatic = new Utils() as any
const utils: Utils & LogicError & _.LoDashStatic = <any>new Utils()
_.merge(utils, _)

export default utils