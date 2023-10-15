import express from 'express'
import bcrypt from 'bcrypt'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'
import ProductModel from '@models/Product'
import CategoryModel from '@models/Category'
import OrderModel from '@models/Order'
import Token from '@/services/TokenService'

const Product = new ProductModel()
const Category = new CategoryModel()
const Order= new OrderModel()

// export default router


/** 
 *  VIEW RENDERING
*/

export const viewRouter = express.Router()

viewRouter.get('/hash', _.routeAsync(async () => {
  const hash = await bcrypt.hash('hello world', 10)
  return { hash }
}
))

viewRouter.get('/login', Token.reqUnauthorized('back'), _.routeAsync(async (req, res) => {
    const alert = req.cookies.alert
    res.clearCookie('alert')
    return { alert }
  },
  _.renderView('app/auth/login', false, 'no-partials.hbs')
))

viewRouter.get('/signup', Token.reqUnauthorized('back'), _.routeAsync(async () => {},
  _.renderView('app/auth/signup', false, 'no-partials.hbs')
))

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