import express from 'express'
import CategoryCtrl, { CategoryExtCtrl } from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'
import { ROLES } from '@/config/global/const'
import { uploadOneImage } from '@/services/LocalUploadService'

const router = express.Router()
const upload = uploadOneImage('img', 'categories', 'upload-cat')

/** 
 *  EXTERNAL
*/

router.get('/e/:slug', CategoryExtCtrl.getOneBySlug())
router.get('/e', CategoryExtCtrl.getMany())


router.get('/test/:id?/:id2?/:id3?', CategoryCtrl.test())
/** 
 *  INTERNAL
*/

// deleted
router.get('/d/:id', Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getOneDeleted())
router.route('/d')
  .get(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getManyDeleted())
  .patch(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.restoreOne())
  .delete(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.destroyOneOrMany())

// (view only)
router.get('/create', Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.createOne())
router.get('/:id/edit', Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.editOne())

router.route('/:id')
  .get(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getOne())
  .put(Auth.reqUserByRole(ROLES.MANAGER), upload, CategoryCtrl.updateOne())
  
router.route('/')
  .get(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.getMany())
  .post(Auth.reqUserByRole(ROLES.MANAGER), upload, CategoryCtrl.storeOne())
  .delete(Auth.reqUserByRole(ROLES.MANAGER), CategoryCtrl.deleteOneOrMany())


export default router