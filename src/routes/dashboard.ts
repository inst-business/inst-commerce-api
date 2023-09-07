import express from 'express'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'
import ProductModel from '@models/Product'
import OrderModel from '@models/Order'

const router = express.Router()

const Product = new ProductModel()
const Order= new OrderModel()

router.get('/',
  _.routeAsync(async () => {
    const fetchRecords = {
      'orders': Order.getMany(),
      'products': Product.getMany()
    }
    const data = _.asyncAllSettled(fetchRecords)
    return data
  },
  _.renderView('app/dashboard/index')
))

router.get('/login',
  _.routeAsync(async () => {},
  _.renderView('app/auth/login', {}, 'no-partials.hbs')
))

router.get('/signup',
  _.routeAsync(async () => {},
  _.renderView('app/auth/signup', {}, 'no-partials.hbs')
))

export default router