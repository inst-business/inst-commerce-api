import express from 'express'
import ProductCtrl, { ProductExtCtrl } from '@controllers/ProductController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'

const router = express.Router()

/** 
 *  EXTERNAL APIs
*/

router.get('/e/:slug', ProductExtCtrl.getOneBySlug())
router.get('/e', ProductExtCtrl.getMany())


/** 
 *  INTERNAL APIs
*/

// deleted
router.get('/d/:id', Auth.reqUser(), ProductCtrl.getOneDeleted())
router.route('/d')
  .get(ProductCtrl.getManyDeleted())
  .patch(ProductCtrl.restoreOne())
  .delete(ProductCtrl.destroyOneOrMany())

// (view only)
router.get('/create', Auth.reqUser(), ProductCtrl.createOne())
router.get('/:id/edit', Auth.reqUser(), ProductCtrl.editOne())

router.route('/:id')
  .get(ProductCtrl.getOne())
  .put(ProductCtrl.updateOne())
  
router.route('/')
  .get(ProductCtrl.getMany())
  .post(Auth.reqUser(), ProductCtrl.storeOne())
  .delete(Auth.reqUser(), ProductCtrl.deleteOneOrMany())


export default router