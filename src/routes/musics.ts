import express from 'express'
import MusicCtrl, { MusicExtCtrl } from '@controllers/MusicController'
import Auth from '@middlewares/Authenticate'
import _ from '@/utils/utils'
import { ROLES } from '@/config/global/const'
import { uploadOneImage } from '@/services/LocalUploadService'

const router = express.Router()
const upload = uploadOneImage('img', 'musics', 'upload-cat')

/** 
 *  EXTERNAL
*/

router.get('/e', MusicExtCtrl.getMany())


// router.get('/test/:id', MusicCtrl.test())
/** 
 *  INTERNAL
*/

// deleted
router.get('/d/:id', Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.getOneDeleted())
router.route('/d')
  .get(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.getManyDeleted())
  .patch(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.restoreOne())
  .delete(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.destroyOneOrMany())

// (view only)
router.get('/create', Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.createOne())
router.get('/:id/edit', Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.editOne())

router.route('/:id')
  .get(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.getOne())
  .put(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.updateOne())
  
router.route('/')
  .get(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.getMany())
  .post(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.storeOne())
  .delete(Auth.reqUserByRole(ROLES.MANAGER), MusicCtrl.deleteOneOrMany())


export default router