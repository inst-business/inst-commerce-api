import Course, { ICourse } from '../models/Course'
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
    const query = Course.findById(id).softDelete()
    const res = await query
    console.log(res)
    
    return res
  }

  static async destroyCourse (id: string): Promise<Object> {
    const query = Course.deleteOne({ _id: id })
    const res = await query
    return res
  }

}

export default CourseController
