import express from 'express'
import CategoryCtrl, { CategoryExtCtrl } from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'

const router = express.Router()

/** 
 *  EXTERNAL
*/

router.get('/e/:slug', CategoryExtCtrl.getOneBySlug())
router.get('/e', CategoryExtCtrl.getMany())


/** 
 *  INTERNAL
*/

// deleted
router.get('/d/:id', Auth.reqUser(), CategoryCtrl.getOneDeleted())
router.route('/d')
  .get(CategoryCtrl.getManyDeleted())
  .patch(CategoryCtrl.restoreOne())
  .delete(CategoryCtrl.destroyOneOrMany())

// (view only)
router.get('/create', CategoryCtrl.createOne())
router.get('/:id/edit', CategoryCtrl.editOne())

router.route('/:id')
  .get(CategoryCtrl.getOne())
  .put(CategoryCtrl.updateOne())
  
router.route('/')
  .get(Auth.reqUser(), CategoryCtrl.getMany())
  .post(Auth.reqUser(), CategoryCtrl.storeOne())
  .delete(Auth.reqUser(), CategoryCtrl.deleteOneOrMany())


export default router