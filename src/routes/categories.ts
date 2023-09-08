import express from 'express'
import CategoryCtrl, { CategoryExtCtrl } from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'
import { ROLES } from '@/config/global/const'
import { upload } from '@/services/UploadService'

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
router.get('/create',
  Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
  CategoryCtrl.createOne()
)
router.get('/:id/edit',
  Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
  CategoryCtrl.editOne()
)

router.route('/:id')
  .get(
    Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
    CategoryCtrl.getOne()
  )
  .put(
    Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
    upload, CategoryCtrl.updateOne()
  )
  
router.route('/')
  .get(
    Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
    CategoryCtrl.getMany()
  )
  .post(
    Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
    upload, CategoryCtrl.storeOne()
  )
  .delete(
    Auth.reqUser(), Auth.reqRole(ROLES.MANAGER),
    CategoryCtrl.deleteOneOrMany()
  )


export default router