import express from 'express'
import 'dotenv/config'
import _ from '@/utils/utils'
import ERR from '@/config/global/error'

class Validate {
  
  static formData (schema: Record<string, unknown>): express.RequestHandler {
    return _.routeNextableAsync(async (req, res, next) => {
      const validate = _.validate(schema)
      // console.log(validate)
      if (validate(req.body)) {
        return next()
      }
      else {
        const err: any = validate.errors
        // res.status(400).json({ error: err })
        throw _.logicError('Validation failed', 'The provided data is invalid.', 400, ERR.INVALID_DATA, ...err)
      }
      // next()
    })
  }

}

export default Validate