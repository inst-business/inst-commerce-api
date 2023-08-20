import express from 'express'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'
import OrderController from '@controllers/OrderController'
import ProductController from '@controllers/ProductController'

const router = express.Router()

router.get(R.CRUD.INDEX,
  _.routeAsync(async () => {
    const fetchRecords = {
      'orders': OrderController.getAll(),
      'products': ProductController.getAll()
    }
    const data = _.asyncAllSettled(fetchRecords)
    return data
  },
  _.renderView('dashboard/index')
))

router.get(R.AUTH.LOGIN,
  _.routeAsync(async () => {},
  _.renderView('dashboard/login', {}, 'no-partials.hbs')
))

router.get(R.AUTH.SIGNUP,
  _.routeAsync(async () => {},
  _.renderView('dashboard/signup', {}, 'no-partials.hbs')
))

export default router