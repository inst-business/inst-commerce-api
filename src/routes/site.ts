import express from 'express'
import siteController from '@controllers/SiteController'
import { ROUTES } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()

router.get(ROUTES.I.INDEX, _.routeAsync(async () => {
}, _.renderView('dashboard/index')
))

export default router