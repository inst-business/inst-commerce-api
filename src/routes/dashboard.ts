import express from 'express'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'
import ProductModel from '@models/Product'
import OrderModel from '@models/Order'

const Product = new ProductModel()
const Order= new OrderModel()

// export default router


/** 
 *  VIEW RENDERING
*/

export const viewRouter = express.Router()

viewRouter.get('/', _.routeAsync(async () => {
    const fetchRecords = {
      'orders': Order.getMany(),
      'products': Product.getMany()
    }
    const data = _.fetchAllSettled(fetchRecords)
    return data
  },
  _.renderView('app/dashboard/index')
))

viewRouter.get('/login', _.routeAsync(async () => {},
  _.renderView('app/auth/login', false, 'no-partials.hbs')
))

viewRouter.get('/signup', _.routeAsync(async () => {},
  _.renderView('app/auth/signup', false, 'no-partials.hbs')
))