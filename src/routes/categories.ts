import express from 'express'
import CategoryCtrl, { CategoryExtCtrl, CategoryViewCtrl } from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'
import { ROLES } from '@/config/global/const'
import { uploadOneImage } from '@/services/LocalUploadService'

const router = express.Router()
const upload = uploadOneImage('img')

/** 
 *  EXTERNAL
*/

router.get('/test/:id?/:id2?/:id3?', CategoryCtrl.test())

router.get('/e/:slug', CategoryExtCtrl.getOneBySlug())
router.get('/e/:slug/list', CategoryExtCtrl.getManyByParentSlug())
router.get('/e', CategoryExtCtrl.getMany())

/** 
 *  INTERNAL
*/

// deleted
router.get('/d/:id', Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getOneDeleted())
router.route('/d')
  .get(Auth.reqUserByRole(ROLES.MANAGER), Auth.reqRules(['u_pd']), CategoryCtrl.getManyDeleted())
  .patch(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.restoreOne())
  .delete(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.destroyOneOrMany())

router.get('/:id/list', Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getManyByParentId())

router.route('/:id')
  .get(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getOne())
  .post(Auth.reqUserByRole(ROLES.MANAGER), upload, CategoryCtrl.storeOne())
  .put(Auth.reqUserByRole(ROLES.MANAGER), upload, CategoryCtrl.updateOne())
  
router.route('/')
  .get(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getMany())
  .post(Auth.reqUserByRole(ROLES.MANAGER), upload, CategoryCtrl.storeOne())
  .delete(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.deleteOneOrMany())


export default router


/** 
 *  VIEW RENDERING
*/

export const viewRouter = express.Router()

viewRouter.get('/d/:id', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.getOneDeleted())
viewRouter.get('/d', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.getManyDeleted())
viewRouter.get('/create', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.createOne())
viewRouter.get('/:id/create', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.createOneChild())
viewRouter.get('/:id/edit', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.editOne())
viewRouter.get('/:id/list', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.getManyByParentId())
viewRouter.get('/:id', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.getOne())
viewRouter.get('/', Auth.reqUserByRole(ROLES.MANAGER), CategoryViewCtrl.getMany())