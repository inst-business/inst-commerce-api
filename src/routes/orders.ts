import express from 'express'
import OrderController from '@controllers/OrderController'
import { IOrder } from '@models/Order'
import Auth from '@middlewares/Authenticate'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()
const OrderCtrl = new OrderController
const pageData = { title: 'orders' }

/** 
 *  EXTERNAL APIs
*/

router.get(R.EXT + R.CRUD.GET_ONE_BYSLUG,
  _.routeAsync(async (req, res) => {
    const { code } = req.params
    const data: IOrder | null = await OrderCtrl.getOneByCode(code)
    return data
  }
))

router.get(R.EXT + R.CRUD.GET_ALL,
  _.routeAsync(async () => {
    const data: IOrder[] = await OrderCtrl.getAll()
    return data
  }
))


/** 
 *  INTERNAL APIs
*/


// Insert one (view only)
router.get(R.CRUD.CREATE,
  // Auth.absoluteDeny(),
  _.routeAsync(async (req, res) => {},
    _.renderView('orders/create')
  )
)

// Edit one (view only)
router.get(R.CRUD.EDIT,
  // Auth.absoluteDeny(),
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IOrder | null = await OrderCtrl.getOneById(id)
    return data
  },
  _.renderView('orders/edit')
))


// Get one deleted

// Restore one

// Permanent delete one

// Get all deleted

// Get one
router.get(R.CRUD.GET_ONE,
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IOrder | null = await OrderCtrl.getOneById(id)
    return data
  },
  _.renderView('orders/detail')
))

// Update one
router.put(R.CRUD.UPDATE_ONE,
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const updatedOrder = await OrderCtrl.updateOne(id, data)
    return updatedOrder
  },
  _.redirectView(`/orders${R.CRUD.GET_ONE}`, 'id')
))

// Get many
router.get(R.CRUD.GET_MANY,
  // Auth.absoluteDeny,
  _.routeAsync(async (req, res) => {
    const data: IOrder[] = await OrderCtrl.getMany()
    return data
  },
  _.renderView('orders/index', pageData)
))

// Store one
router.post(R.CRUD.STORE_ONE,
  _.routeAsync(async (req, res) => {
    const data = req.body
    const submittedOrder = await OrderCtrl.insertOne(data)
    return submittedOrder
  },
  _.redirectView(`/v1/orders${R.CRUD.GET_ALL_DELETED}`)
))

// Delete one


export default router