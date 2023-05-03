
export const VIEWABLE = true

export type ITF_TYPE = 'I' | 'E'

export class ROUTES {
  static I = {
    INDEX: '/i',  // GET
    CREATE: '/i/create',  // GET
    STORE: '/i',  // POST
    SHOW: '/i/:id',  // GET
    EDIT: '/i/:id/edit',  // GET
    UPDATE: '/i/:id',  // PUT
    DESTROY: '/i/:id',  // DELETE
    DEMO: '/i/:id/b/:slug/c/:name/d/:demo',  // DEMO ROUTE
  }

  static E = {
    INDEX: '/e',  // GET
    DETAIL: '/e/:slug',  // GET
  }
}