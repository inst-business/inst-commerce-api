import express from 'express'
import CategoryCtrl, { CategoryExtCtrl, CategoryViewCtrl } from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'
import { ROLE_ARR } from '@/config/global/const'
import { uploadOneImage } from '@/services/LocalUploadService'
import Token from '@/services/TokenService'

const router = express.Router()
const upload = uploadOneImage('thumbnail')

/** 
 *  EXTERNAL
*/

router.get('/test/:id?/:id2?/:id3?', CategoryCtrl.test())
router.post('/test', CategoryCtrl.storeOne())

router.get('/e/:slug', CategoryExtCtrl.getOneBySlug())
router.get('/e/:slug/list', CategoryExtCtrl.getManyByParentSlug())
router.get('/e', CategoryExtCtrl.getMany())

/** 
 *  INTERNAL
*/

// deleted
router.get('/d/:id', Auth.reqAdmin(), CategoryCtrl.getOneDeleted())
router.route('/d')
  .get(Auth.reqAdmin(), Auth.reqRules(['u_pd']), CategoryCtrl.getManyDeleted())
  .patch(Auth.reqAdmin(), CategoryCtrl.restoreOne())
  .delete(Auth.reqAdmin(), CategoryCtrl.destroyOneOrMany())

router.get('/:id/list', Auth.reqAdmin(), CategoryCtrl.getManyByParentId())

router.route('/:id')
  .get(Auth.reqAdmin(), CategoryCtrl.getOne())
  .post(Auth.reqAdmin(), upload, CategoryCtrl.storeOne())
  .put(Auth.reqAdmin(), upload, CategoryCtrl.updateOne())
  
router.route('/')
  .get(Auth.reqAdmin(), CategoryCtrl.getMany())
  .post(Auth.reqAdmin(), upload, CategoryCtrl.storeOne())
  .delete(Auth.reqAdmin(), CategoryCtrl.deleteOneOrMany())


export default router


/** 
 *  VIEW RENDERING
*/

export const viewRouter = express.Router()

viewRouter.get('/d/:id', CategoryViewCtrl.getOneDeleted())
viewRouter.get('/d', CategoryViewCtrl.getManyDeleted())
viewRouter.get('/create', CategoryViewCtrl.createOne())
viewRouter.get('/:id/create', CategoryViewCtrl.createOneChild())
viewRouter.get('/:id/edit', CategoryViewCtrl.editOne())
viewRouter.get('/:id/list', CategoryViewCtrl.getManyByParentId())
viewRouter.get('/:id', CategoryViewCtrl.getOne())
viewRouter.get('/', Token.reqUserOrRedirect('/login'), CategoryViewCtrl.getMany())