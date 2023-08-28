import express from 'express'
import ProductController from '@controllers/ProductController'
import { IProduct } from '@models/Product'
import Auth from '@middlewares/Authenticate'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()
const pageData = { title: 'products' }

/** 
 *  EXTERNAL APIs
*/

router.get(R.EXT + R.CRUD.GET_ONE_BYSLUG,
  _.routeAsync(async (req, res) => {
    const { slug } = req.params
    const data: IProduct | null = await ProductController.getOneBySlug(slug)
    return data
  }
))

router.get(R.EXT + R.CRUD.GET_ALL,
  _.routeAsync(async () => {
    const data: IProduct[] = await ProductController.getAll()
    return data
  }
))


/** 
 *  INTERNAL APIs
*/


// // Insert routes
// router.get(R.CRUD.CREATE,
//   // Auth.absoluteDeny(),
//   _.routeAsync(async (req, res) => {},
//     _.renderView('products/create')
//   )
// )
// // Edit routes
// router.get(R.CRUD.EDIT,
//   // Auth.absoluteDeny(),
//   _.routeAsync(async (req, res) => {
//     const { id } = req.params
//     const data: IProduct | null = await ProductController.getOneById(id)
//     return data
//   },
//   _.renderView('products/edit')
// ))


// Get one deleted
router.get(R.CRUD.GET_ONE_DELETED,
  // Auth.absoluteDeny(),
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IProduct | null = await ProductController.getDeletedById(id)
    return data
  },
  _.renderView('products/deleted/detail', pageData)
))

// Restore one
router.patch(R.CRUD.RESTORE_ONE,
  _.routeAsync(async (req, res) => {
    const { ids } = req.body
    const restoredProduct = await ProductController.restoreOneOrMany(ids)
    return restoredProduct
  },
  _.redirectView('back')
))

// Permanent delete one
router.delete(R.CRUD.DESTROY_ONE,
  _.routeAsync(async (req, res) => {
    const { ids } = req.body
    const result = await ProductController.destroyOneOrMany(ids)
    return result
  },
  _.redirectView('back')
))

// Get all deleted
router.get(R.CRUD.GET_ALL_DELETED,
  // Auth.absoluteDeny(),
  _.routeAsync(async () => {
    const data: IProduct[] = await ProductController.getAllDeleted()
    return data
  },
  _.renderView('products/deleted/index', pageData)
))


// Get one
router.get(R.CRUD.GET_ONE,
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IProduct | null = await ProductController.getOneById(id)
    return data
  },
  _.renderView('products/detail')
))

// Update one
router.put(R.CRUD.UPDATE_ONE,
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const updatedProduct = await ProductController.updateOne(id, data)
    return updatedProduct
  },
  _.redirectView(`/products${R.CRUD.GET_ONE}`, 'id')
))

// Get all
router.get(R.CRUD.GET_ALL,
  // Auth.absoluteDeny,
  _.routeAsync(async (req, res) => {
    // const data: IProduct[] = await ProductController.getAll()
    const fetchData = {
      'items': ProductController.getAll(),
      'deletedCount': ProductController.getDeletedAmount()
    }
    const data = _.asyncAllSettled(fetchData)
    return data
  },
  _.renderView('products/index', pageData)
))

// Store one
router.post(R.CRUD.STORE_ONE,
  _.routeAsync(async (req, res) => {
    const data = req.body
    const submittedProduct = await ProductController.insertOne(data)
    return submittedProduct
  },
  _.redirectView(`/v1/products${R.CRUD.GET_ALL_DELETED}`)
))

// Delete one
router.delete(R.CRUD.DELETE_ONE,
  _.routeAsync(async (req, res) => {
    const { ids } = req.body
    const result = await ProductController.deleteOneOrMany(ids)
    return result
  },
  _.redirectView('back')
))



export default router