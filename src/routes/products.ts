import express from 'express'
import ProductController from '@controllers/ProductController'
import { IProduct } from '@models/Product'
import { ROUTES } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()
const pageData = { title: 'products' }

/** 
 *  INTERNAL APIs
*/

// Insert routes
router.get(ROUTES.I.CREATE, _.routeAsync(async (req, res) => {
}, _.renderView('products/create')
))

router.post(ROUTES.I.STORE, _.routeAsync(async (req, res) => {
  const data = req.body
  const submittedProduct = await ProductController.insertOne(data)
  return submittedProduct
}, _.redirectView(`/products${ROUTES.I.INDEX}`)
))


// Deleted routes
router.get(ROUTES.I.DELETEDS, _.routeAsync(async () => {
  const data: IProduct[] = await ProductController.getAllDeleted()
  return data
}, _.renderView('products/deleted/index', pageData)
))

router.get(ROUTES.I.DELETED, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: IProduct | null = await ProductController.getDeletedById(id)
  return data
}, _.renderView('products/deleted/detail', pageData)
))

router.patch(ROUTES.I.RESTORE, _.routeAsync(async (req, res) => {
  const { ids } = req.body
  const restoredProduct = await ProductController.restoreOneOrMany(ids)
  return restoredProduct
}, _.redirectView('back')
))

router.delete(ROUTES.I.DESTROY, _.routeAsync(async (req, res) => {
  const { ids } = req.body
  const result = await ProductController.destroyOneOrMany(ids)
  return result
}, _.redirectView('back')
))


// Edit routes
router.get(ROUTES.I.EDIT, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: IProduct | null = await ProductController.getOneById(id)
  return data
}, _.renderView('products/edit')
))

router.put(ROUTES.I.UPDATE, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data = req.body
  const updatedProduct = await ProductController.updateOne(id, data)
  return updatedProduct
}, _.redirectView(`/products${ROUTES.I.SHOW}`, 'id')
))


// Delete routes
router.delete(ROUTES.I.DELETE, _.routeAsync(async (req, res) => {
  const { ids } = req.body
  const result = await ProductController.deleteOneOrMany(ids)
  return result
}, _.redirectView('back')
))


// Show routes
router.get(ROUTES.I.SHOW, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: IProduct | null = await ProductController.getOneById(id)
  return data
}, _.renderView('products/detail')
))

router.get(ROUTES.I.INDEX, _.routeAsync(async () => {
  // const data: IProduct[] = await ProductController.getAll()
  const fetchData = {
    'items': ProductController.getAll(),
    'deletedCount': ProductController.getDeletedAmount()
  }
  const data = _.asyncAllSettled(fetchData)
  return data
}, _.renderView('products/index', pageData)
))


/** 
 *  EXTERNAL APIs
*/

router.get(ROUTES.E.DETAIL, _.routeAsync(async (req, res) => {
  const { slug } = req.params
  const data: IProduct | null = await ProductController.getOneBySlug(slug)
  return data
}))

router.get(ROUTES.E.INDEX, _.routeAsync(async () => {
  const data: IProduct[] = await ProductController.getAll()
  return data
}))


export default router