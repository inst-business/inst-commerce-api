
export interface IResultWithPars {
  result: boolean,
  pars?: Array<unknown> | Record<string, unknown>
}

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

export type ITF_TYPE = 'I' | 'E'
// export type ROUTE_TYPE = 'INT' | 'EXT' | 'CRUD' | 'AUTH'
export type ROUTE_TYPE = TProps<typeof R>

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
    INDEX: '/',  // GET
    CREATE: '/create',  // GET
    STORE: '/',  // POST
    DELETEDS: '/deleted',  // GET
    DELETED: '/deleted/:id',  // GET
    RESTORE: '/deleted',  // PATCH
    DESTROY: '/deleted',  // DELETE
    SHOW: '/:id',  // GET
    EDIT: '/:id/edit',  // GET
    UPDATE: '/:id',  // PUT
    DELETE: '/',  // PATCH
    DETAIL: '/:slug',  // GET
  }

  // Authentication routes
  static AUTH = {
    LOGIN: '/login',  // POST
    SIGNUP: '/signup',  // POST
    VERIFY: '/verify',  // POST
    GEN_VERIFY: '/create-verify',  // POST
    INDEX: '/',  // GET
  }
}

// Global variables
export class GV {
  static CONNECT_TIMEOUT = 5000
  static VIEW_ENGINE = true
  static SALT_LENGTH = 16
  static JWT_EXPIRED = '1m'
  static VERIFY_EXPIRED = '5m'
}