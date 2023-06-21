import Course, { ICourse } from '@models/Course'
import _ from '@/utils/utils'

class CourseController {

  static async getAll (): Promise<ICourse[]> {
    const query = Course.find({}).lean()
    const data = await query
    return data
  }

  static async getOneById (id: string): Promise<ICourse | null> {
    const query = Course.findOne({ _id: id }).lean()
    const data = await query
    return data
  }

  static async getOneBySlug (slug: String): Promise<ICourse | null> {
    const query = Course.findOne({ slug: slug }).lean()
    const data = await query
    return data
  }
  
  static async insertOne (course: ICourse): Promise<ICourse> {
    const formData = structuredClone(course)
    formData.slug = course.name
    const query = Course.create(formData)
    const res = await query
    if (res) {
      res.slug = _.genUniqueSlug(course.name, res._id.toString())
      res.save()
    }
    return res
  }

  static async updateOne (id: string, course: ICourse): Promise<ICourse | null> {
    const formData = course
    formData.slug = _.genUniqueSlug(course.name, id)
    const query = Course.findOneAndUpdate({ _id: id }, formData)
    const res = await query
    return res
  }
  
  static async deleteOneOrMany (ids: string | string[]): Promise<Object> {
    const query = Course.find({ _id: ids }).softDelete()
    const res = await query
    return res
  }

  static async getAllDeleted (): Promise<ICourse[]> {
    const query = Course.find({ isDeleted: true }).lean()
    const data = await query
    return data
  }

  static async getDeletedById (id: string): Promise<ICourse | null> {
    const query = Course.findOne({ _id: id, isDeleted: true }).lean()
    const data = await query
    return data
  }

  static async restoreOneOrMany (ids: string | string[]): Promise<Object> {
    const query = Course.find({ _id: ids, isDeleted: true }).restoreDeleted()
    const res = await query
    return res
  }

  static async destroyOneOrMany (id: string | string[]): Promise<Object> {
    const query = Course.deleteOne({ _id: id, isDeleted: true })
    const res = await query
    return res
  }

}

export default CourseController
