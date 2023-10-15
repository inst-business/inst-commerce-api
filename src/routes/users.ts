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



/** 
 *  INTERNAL APIs
*/


export default router