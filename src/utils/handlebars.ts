import { ROUTES, ITF_TYPE } from "../config/global/const"
import _ from "lodash"


const routeParseParams = (type: string, act: string, ...args: any[]): string => {
  const _type = ROUTES[<ITF_TYPE>type.toUpperCase()]
  const _act = act.toUpperCase()
  if (!_type[<keyof typeof _type>_act]) {
    return '#'
  }
  const route = _type[<keyof typeof _type>_act]
  const regex = new RegExp(":\\w+")
  return args.reduce((prev, val) =>
    (_.isString(val) || _.isNumber(val) || val.constructor.name === 'ObjectId')
      ? prev.replace(regex, val?.toString()) : prev
  , route)
}

const routeI = (...args: any[]) => routeParseParams('i', <string>args[0], ...args.slice(1))
const routeE = (...args: any[]) => routeParseParams('e', <string>args[0], ...args.slice(1))

const ifEquals = (arg1: string | number, arg2: string | number, options: any): boolean => 
  (arg1 === arg2) ? options.fn(this) : options.inverse(this)


// const activePage = 

const hbsHelpers = {
  routeI,
  routeE,
  ifEquals,
}

export default hbsHelpers