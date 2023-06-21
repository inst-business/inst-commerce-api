import express from 'express'
import CourseController from '@controllers/CourseController'
import { ICourse } from '@models/Course'
import { ROUTES } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()
const pageData = { title: 'courses' }

/** 
 *  INTERNAL APIs
*/

// Insert routes
router.get(ROUTES.I.CREATE, _.routeAsync(async (req, res) => {
}, _.renderView('courses/create')
))

router.post(ROUTES.I.STORE, _.routeAsync(async (req, res) => {
  const data = req.body
  const submittedCourse = await CourseController.insertOne(data)
  return submittedCourse
}, _.redirectView(`/courses${ROUTES.I.INDEX}`)
))


// Deleted routes
router.get(ROUTES.I.DELETEDS, _.routeAsync(async () => {
  const data: ICourse[] = await CourseController.getAllDeleted()
  return data
}, _.renderView('courses/deleted/index', pageData)
))

router.get(ROUTES.I.DELETED, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: ICourse | null = await CourseController.getDeletedById(id)
  return data
}, _.renderView('courses/deleted/detail', pageData)
))

router.patch(ROUTES.I.RESTORE, _.routeAsync(async (req, res) => {
  const { ids } = req.body
  const restoredCourse = await CourseController.restoreOneOrMany(ids)
  return restoredCourse
}, _.redirectView('back')
))

router.delete(ROUTES.I.DESTROY, _.routeAsync(async (req, res) => {
  const { ids } = req.body
  const result = await CourseController.destroyOneOrMany(ids)
  return result
}, _.redirectView('back')
))


// Edit routes
router.get(ROUTES.I.EDIT, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: ICourse | null = await CourseController.getOneById(id)
  return data
}, _.renderView('courses/edit')
))

router.put(ROUTES.I.UPDATE, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data = req.body
  const updatedCourse = await CourseController.updateOne(id, data)
  return updatedCourse
}, _.redirectView(`/courses${ROUTES.I.SHOW}`, 'id')
))


// Delete routes
router.delete(ROUTES.I.DELETE, _.routeAsync(async (req, res) => {
  const { ids } = req.body
  const result = await CourseController.deleteOneOrMany(ids)
  return result
}, _.redirectView('back')
))


// Show routes
router.get(ROUTES.I.SHOW, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: ICourse | null = await CourseController.getOneById(id)
  return data
}, _.renderView('courses/detail')
))

router.get(ROUTES.I.INDEX, _.routeAsync(async () => {
  const data: ICourse[] = await CourseController.getAll()
  return data
}, _.renderView('courses/index', pageData)
))


/** 
 *  EXTERNAL APIs
*/

router.get(ROUTES.E.DETAIL, _.routeAsync(async (req, res) => {
  const { slug } = req.params
  const data: ICourse | null = await CourseController.getOneBySlug(slug)
  return data
}))

router.get(ROUTES.E.INDEX, _.routeAsync(async () => {
  const data: ICourse[] = await CourseController.getAll()
  return data
}))


export default router