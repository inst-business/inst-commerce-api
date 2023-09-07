import express from 'express'
import AuthCtrl from '@controllers/AuthController'
import Validate from '@middlewares/Validate'
import Auth from '@middlewares/Authenticate'
import UserValidator from '@/resources/validators/user'
import _ from '@/utils/utils'

const router = express.Router()


/** 
 *  EXTERNAL APIs
*/

router.post('/e/login',
  Validate.formData(UserValidator.login),
  Auth.authUser()
)
router.post('/e/signup',
  Validate.formData(UserValidator.signup),
  AuthCtrl.createNewUser()
)
router.post('/e/verify', AuthCtrl.verifyUser())
router.post('/e/create-verify', AuthCtrl.createVerifyToken())

router.post('/e/logout', AuthCtrl.createVerifyToken())


/** 
 *  INTERNAL APIs
*/


export default router