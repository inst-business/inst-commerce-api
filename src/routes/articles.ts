import express from 'express'
import ArticleCtrl, { ArticleExtCtrl } from '@controllers/ArticleController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'

const router = express.Router()


/** 
 *  EXTERNAL APIs
*/

router.get('/e/:slug', ArticleExtCtrl.getOneBySlug())
router.get('/e', ArticleExtCtrl.getMany())


/** 
 *  INTERNAL APIs
*/

// deleted
router.get('/d/:id', Auth.reqUser(), ArticleCtrl.getOneDeleted())
router.route('/d')
  .get(ArticleCtrl.getManyDeleted())
  .patch(ArticleCtrl.restoreOne())
  .delete(ArticleCtrl.destroyOneOrMany())

// (view only)
router.get('/create', Auth.reqUser(), ArticleCtrl.createOne())
router.get('/:id/edit', Auth.reqUser(), ArticleCtrl.editOne())

router.route('/:id')
  .get(ArticleCtrl.getOne())
  .put(ArticleCtrl.updateOne())
  
router.route('/')
  .get(ArticleCtrl.getMany())
  .post(Auth.reqUser(), ArticleCtrl.storeOne())
  .delete(Auth.reqUser(), ArticleCtrl.deleteOneOrMany())

export default router