
export const VIEWABLE = true

export type ITF_TYPE = 'I' | 'E'
export type ITEM_STATUS = 'hidden' | 'pending' | 'active'
export type ORDER_STATUS = 'declined' | 'pending' | 'approved'

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
    INDEX: '/e',  // GET
    DETAIL: '/e/:slug',  // GET
  }
}