import { R, Anycase, ROUTE_TYPE, PRIVACY_TYPE } from '@/config/global/const'
// import _ from 'lodash'
import moment from 'moment'


type compareOperator = 'et' | 'net' | 'gt' | 'gte' | 'lt' | 'lte' | 'or' | 'and'
type DateFormatType = 'detailed' | 'date' | 'time' | 'datetime'

export const hbsHelpers = Object.freeze({
  routeParseParams (privacy: PRIVACY_TYPE, act: string, ...args: any[]): string {
    // const _type = R[<ITF_TYPE>type.toUpperCase()]
    const _privacy = privacy.toLowerCase() === 'e' ? R.EXT : ''
    const _act = act.toUpperCase()
    if (!R[<ROUTE_TYPE>_act]) {
      return '#'
    }
    const route = _privacy[<keyof typeof _privacy>_act]
    const regex = new RegExp(":\\w+")
    return args.reduce((prev, val) =>
      (['string', 'number'].includes(typeof val) || val.constructor.name === 'ObjectId')
        ? prev.replace(regex, val?.toString()) : prev
    , route)
  },

  activeAnchor (title: string, target: string) {
    return title === target ? 'active' : ''
  },

  routeI (...args: any[]) {
    return hbsHelpers.routeParseParams('i', <string>args[0], ...args.slice(1))
  },
  routeE (...args: any[]) {
    return hbsHelpers.routeParseParams('e', <string>args[0], ...args.slice(1))
  },

  equals (arg1: string | number, arg2: string | number, options: any): boolean {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this)
  },
  
  when (arg1: string | number, operator: compareOperator, arg2: string | number, options: any) {
    const conditions = {
      'et': () => arg1 === arg2,
      'net': () => arg1 !== arg2,
      'gt': () => Number(arg1) > Number(arg2),
      'gte': () => Number(arg1) >= Number(arg2),
      'lt': () => Number(arg1) < Number(arg2),
      'lte': () => Number(arg1) <= Number(arg2),
      'or': () => arg1 || arg2,
      'and': () => arg1 && arg2,
    }
    return conditions[operator]()
      // ? options.fn(this) : options.inverse(this)
  },

  dateFormat (timestamp: Date, format?: DateFormatType) {
    const formatTypes = {
      detailed: 'DD-MM-YY LT (Z)',
      datetime: 'DD-MM-YY LT',
      date: 'DD-MM-YY',
      time: 'LT',
    }
    const formatString = !format ? formatTypes.datetime : formatTypes[format]
    return moment(timestamp).format(formatString)
  },

  stylingStatus (status: string) {
    switch (status) {
      case 'approved': return 'success'
      case 'declined': return 'danger'
      case 'pending': return 'warning'
      default: return 'primary'
    }
  },

  increase (n: number, offset: number) {
    return n + offset
  },

})

// export default viewEngineHelpers