import express from 'express'
import slugify from 'slugify'
import uniqueSlug from 'unique-slug'
// import CryptoJS from 'crypto-js'
import crypto from 'crypto'
import _ from 'lodash'
import LogicError, { Primitives } from './logicError'
import ERR from '@/config/global/error'
import { VIEWABLE } from '@/config/global/const'

export type ExpressAsyncRequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>
export type ExpressCallback = (data?: any, err?: any) => void
export type ExpressCallbackProvider = (res: express.Response, req?: express.Request) => ExpressCallback

class Utils {

  async asyncAllSettled (records: Record<string, Promise<any>>) {
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

  routeAsync (reqHandler: ExpressAsyncRequestHandler, callbackProvider?: ExpressCallbackProvider): express.RequestHandler {
    return (req, res, next) => {      
      const cb = callbackProvider
        ? callbackProvider(res, req)
        : this.createServiceCallback(res)
      reqHandler(req, res, next)
        .then(data => cb(data))
        .catch(err => cb(null, err))
    }
  }

  private createServiceCallback (res: express.Response): ExpressCallback {    
    return (data?: any, err?: any) => {
      const resData = data ? structuredClone(data) : {}
      res.statusCode = 200
      if (err) {
        let errObj = { message: err, code: -7 }
        let code
        if (typeof err == 'object') {
          errObj = structuredClone(err)
          errObj.message = err.message
          errObj.code = parseInt(err.code)
          code = err.httpCode
        }
        res.statusCode = (typeof code === 'number' && !isNaN(code))
          ? code : 500
        resData['err'] = errObj
      }
      res.send(resData)
    }
  }

  renderView (view: string, page?: {}, layout?: string): ExpressCallbackProvider {
    return !VIEWABLE
      ? (res) => {
        try {
          throw this.logicError('REJECTED', 'Rendering view has been refused', 406, ERR.RENDER_VIEW_REJECTED, view)
        } catch (e: any) {
          this.errorMsg(e)
          return this.createServiceCallback(res)
        }
      }
      : (res: express.Response, req?: express.Request): ExpressCallback => {
        return (data: any, err?: any) => {
          const reception = { data, page, layout: layout || 'main.hbs' }
          res.render(view, reception)
        }
      }
  }

  redirectView (route: string, ...params: any[]): ExpressCallbackProvider {
    return (res: express.Response, req?: express.Request): ExpressCallback => {
      return (data: any, err?: any) => {
        const args = params.reduce((prev, cur) => 
          (req?.params[cur]) ? [...prev, req.params[cur]] : prev
        , [])
        const url = this.routeParseParams(route, ...args)        
        res.redirect(url)
      }
    }
  }

  logicError (title: string, message: string, httpError: number, errorCode: number, ...pars: Primitives[]): LogicError { 
    return new LogicError(title, message, httpError, errorCode, ...pars)
  }

  errorMsg (e: LogicError) {
    console.error(`${e.title}: ${e.message}\n`, `{http: ${e.httpCode}, error: ${e.errorCode}}\n`, e.pars)
  }
  
  routeParseParams = (route: string, ...args: any[]): string => {
    const regex = new RegExp(":\\w+")
    return args.reduce((prev, val) =>
      (_.isString(val) || _.isNumber(val) || val.constructor.name === 'ObjectId')
        ? prev.replace(regex, val?.toString()) : prev
    , route)
  }

  genUniqueSlug (title: string, code: string) {
    // const uniqueId = uniqueSlug(Date.now().toString())
    const uniqueId = uniqueSlug(code)
    const options = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true, 
    }
    const slug = slugify(`${title} ${uniqueId}`, options)
    return slug
  }

  genOrderCode () {
    const uniqueId = this.genUniqueId()
    // const uniqueId = id
    const timestamp = Date.now().toString()
    // const codeString = uniqueId + timestamp
    const hashString = this.genHash(uniqueId + timestamp)
    return `${hashString.substring(0, 8)}-${uniqueId}`
  }

  genUniqueId () {
    return crypto.randomUUID()
  }

  genHash (data: string) {
    // MD5 hashing algorithm
    return crypto.createHash('md5').update(data).digest('hex')
  }
  
  genRandomString (length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex').slice(0, length)
  }

  genSalt () {
  }

  sha512 (password: string, salt: string) {
    // sha512 hashing algorithm
    let hash = crypto.createHmac('sha512', salt)
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