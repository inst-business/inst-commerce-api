import { ROUTES, ITF_TYPE } from "@/config/global/const"
import _ from "lodash"
import moment from "moment"

const activeAnchor = (title: string, target: string) => title === target ? 'active' : ''

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

const equals = (arg1: string | number, arg2: string | number, options: any): boolean => 
  (arg1 === arg2) ? options.fn(this) : options.inverse(this)

type DateFormatType = 'detailed' | 'date' | 'time' | 'datetime'
const dateFormat = (timestamp: Date, format?: DateFormatType) => {
  const formatTypes = {
    detailed: 'DD-MM-YY LT (Z)',
    datetime: 'DD-MM-YY LT',
    date: 'DD-MM-YY',
    time: 'LT',
  }
  const formatString = !format ? formatTypes.datetime : formatTypes[format]
  return moment(timestamp).format(formatString)
}

const stylingStatus = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'declined': return 'danger'
    case 'pending': return 'warning'
    default: return 'primary'
  }
}

const increase = (n: number, offset: number) => n + offset

const hbsHelpers = {
  routeI,
  routeE,
  equals,
  activeAnchor,
  dateFormat,
  stylingStatus,
  increase,
}

export default hbsHelpers