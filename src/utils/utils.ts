import express from 'express'
import slugify from 'slugify'
import uniqueSlug from 'unique-slug'
import _ from 'lodash'
import LogicError, { Primitives } from './logicError'
import ERR from './../config/global/error'
import { VIEWABLE } from './../config/global/const'

export type ExpressAsyncRequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>
export type ExpressCallback = (data?: any, err?: any) => void
export type ExpressCallbackProvider = (res: express.Response, req?: express.Request) => ExpressCallback

class Utils {

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
      const resData = data ? JSON.parse(JSON.stringify(data)) : {}
      res.statusCode = 200
      if (err) {
        let errObj = { message: err, code: -7 }
        let code
        if (typeof err == 'object') {
          errObj = JSON.parse(JSON.stringify(err))
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

  renderView (view: string): ExpressCallbackProvider {
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
          res.render(view, data)
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

  genUniqueSlug (title: string) {
    const uniqueId = uniqueSlug(Date.now().toString())
    const options = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true, 
    }
    const slug = slugify(`${title} ${uniqueId}`, options)
    return slug
  }
  
  routeParseParams = (route: string, ...args: any[]): string => {
    const regex = new RegExp(":\\w+")
    return args.reduce((prev, val) =>
      (_.isString(val) || _.isNumber(val) || val.constructor.name === 'ObjectId')
        ? prev.replace(regex, val?.toString()) : prev
    , route)
  }

}

// const utils: Utils & _.LoDashStatic = new Utils() as any
const utils: Utils & LogicError & _.LoDashStatic = <any>new Utils()
_.merge(utils, _)

export default utils