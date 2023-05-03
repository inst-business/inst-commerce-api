import Course, { ICourse } from '../models/Course'
import { mongooseToObj } from '../../utils/mongoose'
import _ from '../../utils/utils'


class CourseController {

  static async getAll (): Promise<ICourse[]> {
    const query = Course.find({}).lean()
    const data = await query
    return data
  }

  static async getById (id: string): Promise<ICourse | null> {
    const query = Course.findOne({ _id: id }).lean()
    const data = await query
    return data
  }

  static async getBySlug (slug: String): Promise<ICourse | null> {
    const query = Course.findOne({ slug: slug }).lean()
    const data = await query
    return data
  }
  
  static async insertNewCourse (course: ICourse): Promise<ICourse> {
    const formData = course
    formData.slug = _.genUniqueSlug(course.name)
    const query = Course.create(formData)
    const res = await query
    return res
  }

  static async updateCourse (id: string, course: ICourse): Promise<ICourse | null> {
    const formData = course
    formData.slug = _.genUniqueSlug(course.name)
    const query = Course.findOneAndUpdate({ _id: id }, formData)
    const res = await query
    return res
  }

  static async deleteCourse (id: string): Promise<Object> {
    const query = Course.deleteOne({ _id: id })
    const res = await query
    return res
  }

  // // GET: /courses
  // static async index (req, res, next) {
  //   Course.find({}).lean()
  //     .then(courses => 
  //       res.render('courses/index', { courses, _coursePage })
  //     )
  //     .catch(next)
  // }

  // // GET: /course/:slug
  // static detail (req, res, next) {
  //   Course.findOne({ slug: req.params.slug }).lean()
  //     .then(course => 
  //       res.render('courses/detail', { course, _coursePage })
  //     )
  //     .catch(next)
  // }
}

export default CourseController
