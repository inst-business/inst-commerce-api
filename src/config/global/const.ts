
export const ENV = process.env

export interface IResultWithPars {
  result: boolean,
  pars?: Array<unknown> | Record<string, unknown>
}

export type Anycase<T extends string> = Uppercase<T> | Lowercase<T>

export type TRes<T extends (...args: any[]) => any> =
  NonNullable<Awaited<ReturnType<T>>>
export type TNullableRes<T extends (...args: any[]) => any> =
  Awaited<ReturnType<T>>

export type Many<T> = T | ReadonlyArray<T>
export type Primitives = string | number | boolean
export type PropsKey = string | number | symbol
export type RecursiveArray<T> = Array<RecursiveArray<T> | T>
export type TProps<T> = {
  [K in keyof T]: T[K] extends Primitives | Record<string, Primitives> ? K : never
}[keyof T]
export type ErrPars = Array<Primitives | Record<PropsKey, unknown>>

// export type ITF_TYPE = 'I' | 'E'
export type PRIVACY_TYPE = Anycase<'I' | 'E'>
// export type ROUTE_TYPE = 'INT' | 'EXT' | 'CRUD' | 'AUTH'
export type ROUTE_TYPE = TProps<typeof R>

export type AVAILABLE_LANGS = 'en' | 'vi'
export type SORT_ORDER = 'asc' | 'desc'
export type GENDER = 'male' | 'female' | 'other'
export type ITEM_STATUS = 'hidden' | 'pending' | 'active'
export type ORDER_STATUS = 'declined' | 'pending' | 'approved'

export type ACCOUNT_STATUS = 'banned' | 'pending' | 'active'
export const ACCOUNT_STATUS_ARR = {
  BANNED: 'banned',
  PENDING: 'pending',
  ACTIVE: 'active',
}
export type ACCOUNT_ROLE = 'guess' | 'customer' | 'manager' | 'admin'


// Routes
export class R {

  static INT = '/i'
  static EXT = '/e'

  // CRUD routes
  static CRUD = {
    TEST: '/test',  // test ROUTE
    
    CREATE: '/create',  // GET
    EDIT: '/:id/edit',  // GET

    GET_ONE_DELETED: '/d/:id',  // GET
    GET_ALL_DELETED: '/d',  // GET
    RESTORE_ONE: '/d',  // PATCH
    DESTROY_ONE: '/d',  // DELETE

    GET_ONE: '/:id',  // GET
    UPDATE_ONE: '/:id',  // PUT
    GET_ONE_BYSLUG: '/:slug',  // GET
    UPDATE_ONE_BYSLUG: '/:slug',  // PUT
    GET_MANY: '/',  // GET
    GET_ALL: '/',  // GET
    STORE_ONE: '/',  // POST
    DELETE_ONE: '/',  // DELETE
  }

  // Authentication routes
  static AUTH = {
    LOGIN: '/login',  // POST
    SIGNUP: '/signup',  // POST
    LOGOUT: '/logout',  // GET

    VERIFY: '/verify',  // POST
    RESET: '/reset',  // POST
    GEN_VERIFY: '/create-verify',  // POST
    CHANGE_PASSWORD: '/change-password',  // PATCH
    FORGOT_PASSWORD: '/forgot-password',  // POST
    RESET_PASSWORD: '/reset-password',  // PATCH
    INDEX: '/',  // GET
  }
}


// Global variables
export class GV {
  static _1S = 1000
  static _1M = 60 * this._1S
  static _1H = 60 * this._1M
  static _1D = 24 * this._1H
  static _1W = 24 * this._1D

  static DEFAULT_LANG: AVAILABLE_LANGS = 'en'
  static VIEW_ENGINE = true
  static COOKIE_SECURE = ENV.COOKIE_SECURE === 'true' ? true : false
  static CONNECT_TIMEOUT = 5000
  static JWT_EXPIRED = '1m'
  static VERIFY_EXPIRED = '5m'
  static SESSION_EXPIRED = 5 * this._1M
  static SALT_LENGTH = 16

  static DEFAULT_STATUS = 'pending'
}


// Global RegExs
export class REGEX {
  static VALID_VAR_NAME = /^[a-zA-Z_$][\w$]*$/i
  static VALID_PROP_CALL = /^([a-zA-Z_$][\w$]*)\.([a-zA-Z_$][\w$]*)$/i
}