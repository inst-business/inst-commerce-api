import express from 'express'
import CourseController from '../app/controllers/CourseController'
import { ICourse } from '../app/models/Course'
import { ROUTES } from '../config/global/const'
import _ from '../utils/utils'

const router = express.Router()

const viewData = (data: any) => ({
  data,
  _coursesPage: true
})

//  Internal routes

router.get(ROUTES.I.CREATE, _.routeAsync(async (req, res) => {
}, _.renderView('courses/create')
))

router.post(ROUTES.I.STORE, _.routeAsync(async (req, res) => {
  const data = req.body
  const submittedCourse = await CourseController.insertNewCourse(data)
  return submittedCourse
}, _.redirectView(`/courses${ROUTES.I.INDEX}`)
))

router.get(ROUTES.I.EDIT, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: ICourse | null = await CourseController.getById(id)
  return viewData(data)
}, _.renderView('courses/edit')
))

router.put(ROUTES.I.UPDATE, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data = req.body
  const updatedCourse = await CourseController.updateCourse(id, data)
  return updatedCourse
}, _.redirectView(`/courses${ROUTES.I.SHOW}`, 'id')
))

router.delete(ROUTES.I.DESTROY, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const result = await CourseController.deleteCourse(id)
  return result
}, _.redirectView('back')
))

router.get(ROUTES.I.SHOW, _.routeAsync(async (req, res) => {
  const { id } = req.params
  const data: ICourse | null = await CourseController.getById(id)
  return viewData(data)
}, _.renderView('courses/detail')
))

router.get(ROUTES.I.INDEX, _.routeAsync(async () => {
  const data: ICourse[] = await CourseController.getAll()
  return viewData(data)
}, _.renderView('courses/index')
))

//  External routes

router.get(ROUTES.E.DETAIL, _.routeAsync(async (req, res) => {
  const { slug } = req.params
  const data: ICourse | null = await CourseController.getBySlug(slug)
  return data
}))

router.get(ROUTES.E.INDEX, _.routeAsync(async () => {
  const data: ICourse[] = await CourseController.getAll()
  return data
}))

export default router