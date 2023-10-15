import OrderModel, { IOrder } from '@models/Order'
import _ from '@/utils/utils'
import ERR from '@/config/global/error'

const Order = new OrderModel()

class OrderCtrl {

  static getOne () {
    return _.routeAsync(async (req, res) => {
      const { id } = req.params
      const data: IOrder | null = await Order.getOneById(id)
      return data
    },
    _.renderView('app/orders/detail')
  )}

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const data = Order.getMany()
      return data
    },
    _.renderView('app/orders/index')
  )}

}
export default OrderCtrl


/** 
 *  EXTERNAL
*/
export class OrderExtCtrl {

  static getMany () {
    return _.routeAsync(async (req, res) => {
      const data: IOrder[] = await Order.getMany()
      return data
    })
  }

  static getOneBySlug () {
    return _.routeAsync(async (req, res) => {
      const { slug } = req.params
      const data: IOrder | null = await Order.getOneBySlug(slug)
      return data
    })
  }

}