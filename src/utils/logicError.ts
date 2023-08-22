import { ErrPars } from '@/config/global/const'

class LogicError extends Error {
  title: string
  message: string
  httpCode: number
  errorCode: number
  stack?: string
  // pars: Primitives[]
  pars: ErrPars

  constructor (title: string, message: string, httpCode: number, errorCode: number, ...pars: ErrPars) {
    super()
    this.title = title
    this.message = message
    this.httpCode = httpCode
    this.errorCode = errorCode
    this.stack = undefined
    this.pars = pars
  }

  withStack () {
    this.stack = (new Error(this.message)).stack
    return this
  }

  toJSON (): Record<string, unknown> {
    return <any>{
      httpCode: this.httpCode,
      code: this.errorCode,
      title: this.title,
      message: this.message,
      pars: this.pars,
      ...(this.stack && {stack: this.stack})
    }
  }
}

export default LogicError