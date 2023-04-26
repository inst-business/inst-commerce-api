import Course from '../models/Course'
import { mongooseToObj } from '../../utils/mongoose'

class CourseController {
  // GET: /courses
  static index (req, res, next) {
    Course.find({}).lean()
      .then(courses => 
        res.render('courses/index', { courses })
      )
      .catch(next)
    // Course.find({})
    //   .then(courses =>
    //     res.render('courses', {
    //       courses : mongoosesToObj(courses)
    //     })
    //   )
    //   .catch(next)
  }

  // GET: /course/:slug
  static detail (req, res, next) {
    Course.findOne({ slug: req.params.slug }).lean()
      .then(course => 
        res.render('courses/detail', { course })
      )
      .catch(next)
  }
}

export default CourseController
