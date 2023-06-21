import ERR from "@/config/global/error"

export type Primitives = string | number | boolean

class LogicError extends Error {
  title: string
  message: string
  httpCode: number
  errorCode: number
  pars: Primitives[]

  constructor (title: string, message: string, httpCode: number, errorCode: number, ...pars: Primitives[]) {
    super()
    this.title = title
    this.message = message
    this.httpCode = httpCode
    this.errorCode = errorCode
    this.pars = pars
    // this.stack = (new Error(message)).stack
  }

  toJSON () {
    return {
      httpCode: this.httpCode,
      code: this.errorCode,
      title: this.title,
      message: this.message,
      pars: this.pars,
    }
  }
}

export default LogicError