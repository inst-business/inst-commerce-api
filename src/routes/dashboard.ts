import express from 'express'
import { ROUTES } from '@/config/global/const'
import _ from '@/utils/utils'
import { IOrder } from '@models/Order'
import OrderController from '@controllers/OrderController'
import ProductController from '@controllers/ProductController'

const router = express.Router()

router.get(ROUTES.I.INDEX, _.routeAsync(async () => {
  const fetchRecords = {
    'orders': OrderController.getAll(),
    'products': ProductController.getAll()
  }
  const data = _.asyncAllSettled(fetchRecords)
  return data
}, _.renderView('dashboard/index')
))

export default router