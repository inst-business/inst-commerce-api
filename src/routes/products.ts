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

router.get(R.EXT + R.CRUD.DETAIL,
  _.routeAsync(async (req, res) => {
    const { slug } = req.params
    const data: IProduct | null = await ProductController.getOneBySlug(slug)
    return data
  }
))

router.get(R.EXT + R.CRUD.INDEX,
  _.routeAsync(async () => {
    const data: IProduct[] = await ProductController.getAll()
    return data
  }
))


/** 
 *  INTERNAL APIs
*/

// Insert routes
router.get(R.CRUD.CREATE,
  // Auth.absoluteDeny(),
  _.routeAsync(async (req, res) => {},
    _.renderView('products/create')
  )
)

router.post(R.CRUD.STORE,
  _.routeAsync(async (req, res) => {
    const data = req.body
    const submittedProduct = await ProductController.insertOne(data)
    return submittedProduct
  },
  _.redirectView(`/v1/products${R.CRUD.INDEX}`)
))


// Deleted routes
router.get(R.CRUD.DELETEDS,
  // Auth.absoluteDeny(),
  _.routeAsync(async () => {
    const data: IProduct[] = await ProductController.getAllDeleted()
    return data
  },
  _.renderView('products/deleted/index', pageData)
))

router.get(R.CRUD.DELETED,
  // Auth.absoluteDeny(),
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IProduct | null = await ProductController.getDeletedById(id)
    return data
  },
  _.renderView('products/deleted/detail', pageData)
))

router.patch(R.CRUD.RESTORE,
  _.routeAsync(async (req, res) => {
    const { ids } = req.body
    const restoredProduct = await ProductController.restoreOneOrMany(ids)
    return restoredProduct
  },
  _.redirectView('back')
))

router.delete(R.CRUD.DESTROY,
  _.routeAsync(async (req, res) => {
    const { ids } = req.body
    const result = await ProductController.destroyOneOrMany(ids)
    return result
  },
  _.redirectView('back')
))


// Edit routes
router.get(R.CRUD.EDIT,
  // Auth.absoluteDeny(),
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IProduct | null = await ProductController.getOneById(id)
    return data
  },
  _.renderView('products/edit')
))

router.put(R.CRUD.UPDATE,
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data = req.body
    const updatedProduct = await ProductController.updateOne(id, data)
    return updatedProduct
  },
  _.redirectView(`/products${R.CRUD.SHOW}`, 'id')
))


// Delete routes
router.delete(R.CRUD.DELETE,
  _.routeAsync(async (req, res) => {
    const { ids } = req.body
    const result = await ProductController.deleteOneOrMany(ids)
    return result
  },
  _.redirectView('back')
))


// Show routes
router.get(R.CRUD.SHOW,
  _.routeAsync(async (req, res) => {
    const { id } = req.params
    const data: IProduct | null = await ProductController.getOneById(id)
    return data
  },
  _.renderView('products/detail')
))

router.get(R.CRUD.INDEX,
  Auth.absoluteDeny,
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


export default router