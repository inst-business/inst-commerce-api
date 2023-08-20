
export const VIEWABLE = true

export interface IResultWithPars {
  result: boolean,
  pars?: Array<unknown> | Record<string, unknown>
}

export type TRes<T extends (...args: any[]) => any> =
  NonNullable<Awaited<ReturnType<T>>>
export type TNullableRes<T extends (...args: any[]) => any> =
  Awaited<ReturnType<T>>

export type Primitives = string | number | boolean

export type ITF_TYPE = 'I' | 'E'
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

export class ROUTES {
  static I = {
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
  }

  static E = {
    LOGIN: '/e/login',  // POST
    SIGNUP: '/e/signup',  // POST
    VERIFY: '/e/verify',  // POST
    GEN_VERIFY: '/e/create-verify',  // POST
    INDEX: '/e',  // GET
    DETAIL: '/e/:slug',  // GET
  }
}

// Global variables
export class GV {
  static CONNECT_TIMEOUT = 5000
  static VIEW_ENGINE = true
  static SALT_LENGTH = 16
  static JWT_EXPIRED = '15s'
  static VERIFY_EXPIRED = '30s'
}