import {
  R, Anycase, Primitives, AVAILABLE_LANGS, PRIVACY_TYPE, REGEX
} from '@/config/global/const'
// import _ from 'lodash'
// import moment from 'moment'


type compareOperator = 'et' | 'net' | 'gt' | 'gte' | 'lt' | 'lte' | 'or' | 'and'
type DateFormatType = 'detailed' | 'date' | 'time' | 'datetime'

export const hbsHelpers = Object.freeze({

  routeParseParams (privacy: PRIVACY_TYPE, act: string, ...args: any[]): string {
    let route
    if (REGEX.VALID_VAR_NAME.test(act)) {
      route = (<any>R)[act.toUpperCase()]
    }
    if (REGEX.VALID_PROP_CALL.test(act)) {
      const routeInfos = act.split('.', 2).map(a => a.toUpperCase())
      route = (<any>R)[routeInfos[0]][routeInfos[1]]
    }
    // console.log(act, route, args)
    if (!route) return '#'
    const _privacy = privacy.toUpperCase() === 'E' ? R.EXT : ''
    const ParamsRegex = new RegExp(":\\w+")
    return args.reduce((prev, val) =>
      (['string', 'number'].includes(typeof val) || val.constructor.name === 'ObjectId')
        ? prev.replace(ParamsRegex, val?.toString()) : prev
    , _privacy + route)
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

  // dateFormat (timestamp: Date, format?: DateFormatType, local: string = 'vi') {
  //   const types = {
  //     detailed: 'DD-MM-YY LT (Z)',
  //     datetime: 'DD-MM-YY LT',
  //     date: 'DD-MM-YY',
  //     time: 'LT',
  //   }
  //   const pattern = !format ? types.datetime : types[format]
  //   // console.log(timestamp, timestamp.toLocaleString())
  //   return moment(timestamp.toLocaleString()).format(pattern)
  // },
  
  dateFormat (timestamp: Date, format: DateFormatType, local: AVAILABLE_LANGS, options: any) {
    local = (local != null && typeof local === 'string') ? local : 'vi'
    const types = {
      detailed: { dateStyle: 'long', timeStyle: 'long' },
      datetime: { dateStyle: 'medium', timeStyle: 'medium' },
      date: {
        // dateStyle: 'long',
        weekday: 'narrow', day: 'numeric',
        month: 'short', year: 'numeric',
      },
      time: {
        // timeStyle: 'long', hour12: true,
        hour: '2-digit', minute: '2-digit',
        second: '2-digit', timeZoneName: 'short'
      },
    } 
    const pattern = (format != null || typeof format !== 'string')
      ? types[format] : types.datetime
    const formatter = new Intl.DateTimeFormat(local, <any>pattern)
    return formatter.format(new Date(timestamp))
  },

  webpFormat (path: string, options: any) {
    path = (path != null && typeof path === 'string') ? path : ''
    // const regex = /\.[^.]+$/
    const webpPath = path.replace(REGEX.FILE_EXTENSION, '.webp')
    console.log('paths: ', path, webpPath)
    return webpPath
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