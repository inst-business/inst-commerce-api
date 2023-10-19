import express from 'express'
import CategoryController, {
  CategoryExternalController, CategoryViewController
} from '@controllers/CategoryController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'
import { ADMIN_ROLE } from '@/config/global/const'
import { uploadOneImage } from '@/services/LocalUploadService'
import Token from '@/services/TokenService'

const router = express.Router()
const upload = uploadOneImage('thumbnail')
const External = new CategoryExternalController()
const Internal = new CategoryController()

/** 
 *  EXTERNAL
*/

router.get('/test/:id?/:id2?/:id3?', Internal.test())
router.post('/test', Internal.storeOne())

router.get('/e/:slug', External.getOneBySlug())
router.get('/e/:slug/list', External.getManyByParentSlug())
router.get('/e', External.getMany())

/** 
 *  INTERNAL
*/

// deleted
router.get('/d/:id', Auth.reqAdmin(), Internal.getOneDeleted())
router.route('/d')
  .get(Auth.reqAdmin(), Auth.reqRules(['u_pd']), Internal.getManyDeleted())
  .patch(Auth.reqAdmin(), Internal.restoreOne())
  .delete(Auth.reqAdmin(), Internal.destroyOneOrMany())

router.get('/:id/list', Auth.reqAdmin(), Internal.getManyByParentId())

router.route('/:id')
  .get(Auth.reqAdmin(), Internal.getOne())
  .post(Auth.reqAdmin(), upload, Internal.storeOne())
  .put(Auth.reqAdmin(), upload, Internal.updateOne())
  
router.route('/')
  .get(Auth.reqAdmin(), Internal.getMany())
  .post(Auth.reqAdmin(), upload, Internal.storeOne())
  .delete(Auth.reqAdmin(), Internal.deleteOneOrMany())


export default router


/** 
 *  VIEW RENDERING
*/
export const viewRouter = express.Router()
const View = new CategoryViewController()

viewRouter.get('/d/:id', View.getOneDeleted())
viewRouter.get('/d', View.getManyDeleted())
viewRouter.get('/create', View.createOne())
viewRouter.get('/:id/create', View.createOneChild())
viewRouter.get('/:id/edit', View.editOne())
viewRouter.get('/:id/list', View.getManyByParentId())
viewRouter.get('/:id', View.getOne())
viewRouter.get('/', Token.reqUserOrRedirect('/login'), View.getMany())