
export const ENV = process.env

export interface IResultWithPars {
  result: boolean,
  pars?: Array<unknown> | Record<string, unknown>
}

export type Anycase<T extends string> = Uppercase<T> | Lowercase<T>

export type TRes<T extends (...args: any[]) => any> = NonNullable<Awaited<ReturnType<T>>>
export type TNullableRes<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>

export type Many<T> = T | ReadonlyArray<T>
export type Primitives = string | number | boolean
export type PropsKey = string | number | symbol
export type Keys<T> = keyof T
export type ExcludableKeys<T> = keyof T | {
  [K in keyof T]: K extends string ? `-${K}` : K
}[keyof T]
export type ExcludeKeys<T, K> = Exclude<keyof T, keyof K>
export type RecursiveArray<T> = Array<RecursiveArray<T> | T>
export type TProps<T> = {
  [K in keyof T]: T[K] extends Primitives | Record<string, Primitives> ? K : never
}[keyof T]
export type ErrPars = Array<Primitives | Record<PropsKey, unknown>>

// export type ITF_TYPE = 'I' | 'E'
export type PRIVACY_SHORTHAND = Anycase<'I' | 'E'>
// export type ROUTE_TYPE = 'INT' | 'EXT' | 'CRUD' | 'AUTH'
export type ROUTE_TYPE = TProps<typeof R>

export type AVAILABLE_LANGS = 'en' | 'vi'
export type SORT_ORDER = 'asc' | 'desc'

// export const GENDER_ARR = ['male', 'female', 'other'] as const
// export type GENDER = typeof GENDER_ARR[number]
export enum GENDER { OTHER, FEMALE, MALE }

// export const FLAG_ARR = Object.freeze({
//   ACCOUNT: ['warned', 'restricted', 'banned'] as const,
//   ITEM: ['warned', 'restricted', 'banned'] as const,
// })
// export type FLAG = {
//   [K in keyof typeof FLAG_ARR]: typeof FLAG_ARR[K][number]
// }
export enum FLAG { WARNED, RESTRICTED, BANNED }

export enum ACCOUNT_TYPE { USER, SELLER, ADMIN }
export enum PRIVACY_TYPE { PRIVATE, SHARED, PUBLIC }
export enum ITEM_TYPE { PRODUCT, ARTICLE }
export enum INTERACTION_TYPE { OBJECT, COMMENT }
export enum PAYMENT_TYPE { COD, E_WALLET, CREDIT }
export enum DELIVERY_TYPE { CASUAL, EXPRESS }
export abstract class TYPE {
  static ACCOUNT = ACCOUNT_TYPE
  static PRIVACY = PRIVACY_TYPE
  static ITEM = ITEM_TYPE
  static INTERACTION = INTERACTION_TYPE
  static PAYMENT = PAYMENT_TYPE
  static DELIVERY = DELIVERY_TYPE
}

export enum ACCOUNT_STATUS { HIDDEN, PENDING, ACTIVE }
export enum ITEM_STATUS { HIDDEN, PENDING, ACTIVE }
export enum APPROVAL_STATUS { DECLINED, PENDING, APPROVED }
export enum PROCESS_STATUS { PREPARING, PROCESSING, COMPLETED, REJECTED }
export const STATUS = {
  ACCOUNT: ACCOUNT_STATUS,
  ITEM: ITEM_STATUS,
  APPROVAL: APPROVAL_STATUS,
  PROCESS: PROCESS_STATUS,
}

export enum ADMIN_ROLE { MODERATOR, ADMIN, ROOT }
export enum SELLER_ROLE { STAFF, MANAGER, CO_OWNER, OWNER }
export enum USER_ROLE { NORMAL, FREQUENT, ELITE, VIP }
export abstract class ROLE {
  static ADMIN = ADMIN_ROLE
  static SELLER = SELLER_ROLE
  static USER = USER_ROLE
}

export interface RULE {
  ADMIN: 'view_admin' | 'modify_admin' | 'remove_admin'
  MANAGER: 'view_manager' | 'modify_manager' | 'remove_manager'
  SELLER: 'view_seller' | 'ban_seller' | 'remove_seller'
  USER: 'view_user' | 'ban_user'
  PRODUCT: 'r_pd' | 'u_pd' | 'view_removed_product' | 'modify_removed_product'
  CATEGORY: 'view_category' | 'modify_category' | 'view_removed_category' | 'modify_removed_category'
  ARTICLE: 'view_article' | 'modify_article' | 'view_removed_article' | 'modify_removed_article'
}
export type ALL_RULES = RULE[keyof RULE]


export interface USER_SIGN {
  username: string
  email: string
  tel: string
  name: {
    firstname: string
    lastname: string
  }
  avatar?: string
  role: USER_ROLE
  // permissions?: ALL_RULES[]
}

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
    GET_MANY_DELETED: '/d',  // GET
    GET_ALL_DELETED: '/d',  // GET
    RESTORE: '/d',  // PATCH
    DESTROY: '/d',  // DELETE

    GET_ONE: '/:id',  // GET
    UPDATE_ONE: '/:id',  // PUT
    GET_ONE_BYSLUG: '/:slug',  // GET
    UPDATE_ONE_BYSLUG: '/:slug',  // PUT
    GET_MANY: '/',  // GET
    GET_ALL: '/',  // GET
    STORE_ONE: '/',  // POST
    DELETE: '/',  // DELETE
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
  static ALLOW_VIEW_ENGINE = true
  static ALLOW_LOCAL_STORING = true
  static COOKIE_SECURE = ENV.COOKIE_SECURE === 'true' ? true : false
  static CONNECT_TIMEOUT = 5000
  static ACCESS_TOKEN_EXPIRED = '96h'
  static REFRESH_TOKEN_EXPIRED = '24h'
  static VERIFY_EXPIRED = '5m'
  static SESSION_EXPIRED = 5 * this._1M
  static TEMP_DATA_EXPIRED = '1d'
  static SALT_LENGTH = 10

  static DEFAULT_STATUS = 'pending'
  static IMG_EXT_ALLOWED = 'jpg'
  static IMG_MIMETYPES_ALLOWED = ['image/jpeg', 'image/png']
  static IMG_EXTENSIONS_ALLOWED = ['.jpeg', '.jpg', '.png']
  static IMG_REDUCE_EXT = 'webp'

  static UPLOADED_PATH = 'public/uploads/'
}


// Global RegExs
export class REGEX {
  static VALID_VAR_NAME = /^[a-zA-Z_$][\w$]*$/i
  static VALID_PROP_CALL = /^([a-zA-Z_$][\w$]*)\.([a-zA-Z_$][\w$]*)$/i

  static FILE_EXTENSION = /\.[^.]+$/
}