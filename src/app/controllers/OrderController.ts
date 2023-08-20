import Order, { IOrder } from '@models/Order'
import _ from '@/utils/utils'
import { handleQuery } from '@/utils/mongoose'

class OrderController {

  static async getAll (): Promise<IOrder[]> {
    const query = Order.find({}).lean()
    const data = await handleQuery(query)
    return data
  }

  static async getOneById (id: string): Promise<IOrder | null> {
    const query = Order.findOne({ _id: id }).lean()
    const data = await handleQuery(query)
    return data
  }

  static async getOneByCode (code: String): Promise<IOrder | null> {
    const query = Order.findOne({ code: code }).lean()
    const data = await handleQuery(query)
    return data
  }
  
  static async insertOne (order: IOrder): Promise<IOrder> {
    const formData = structuredClone(order)
    formData.code = _.genOrderCode()
    const query = Order.create(formData)
    const res = await handleQuery(query)
    return res
  }

}

export default OrderController
