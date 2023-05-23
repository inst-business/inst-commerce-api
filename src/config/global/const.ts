
export const VIEWABLE = true

export type ITF_TYPE = 'I' | 'E'
export type STATUS = 'hidden' | 'pending' | 'active'

export class ROUTES {
  static I = {
    // DEMO: '/i/:id/b/:slug/c/:name/d/:demo',  // DEMO ROUTE
    INDEX: '/i',  // GET
    CREATE: '/i/create',  // GET
    STORE: '/i',  // POST
    SHOW: '/i/:id',  // GET
    EDIT: '/i/:id/edit',  // GET
    UPDATE: '/i/:id',  // PUT
    DELETE: '/i/:id',  // PATCH
    DESTROY: '/i/:id',  // DELETE
  }

  static E = {
    INDEX: '/e',  // GET
    DETAIL: '/e/:slug',  // GET
  }
}