import express from 'express'
import CourseController from '../app/controllers/CourseController'

const router = express.Router()

router.get('/:slug', CourseController.detail)
router.get('/', CourseController.index)

export default router