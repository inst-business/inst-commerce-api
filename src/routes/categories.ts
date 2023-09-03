import express from 'express'
import CategoryCtrl, { CategoryExtCtrl } from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()

/** 
 *  EXTERNAL
*/

router.get('/e/:slug', CategoryExtCtrl.getOneBySlug)
router.get('/e', CategoryExtCtrl.getMany)


/** 
 *  INTERNAL
*/

// deleted
router.get('/:id', CategoryCtrl.getOneDeleted)
router.route('/d')
  .get(CategoryCtrl.getManyDeleted)
  .patch(CategoryCtrl.restoreOne)
  .delete(CategoryCtrl.destroyOneOrMany)

// (view only)
router.get('/create', CategoryCtrl.createOne)
router.get('/:id/edit', CategoryCtrl.editOne)

router.get('/:id', CategoryCtrl.getOne)
router.put('/:id', CategoryCtrl.updateOne)
router.get('/', CategoryCtrl.getMany)
router.post('/', CategoryCtrl.storeOne)
router.delete('/', CategoryCtrl.deleteOneOrMany)


export default router