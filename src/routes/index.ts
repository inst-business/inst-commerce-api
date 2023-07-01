import express, { Router } from 'express'
import { default as courses } from './courses'
import { default as dashboard } from './dashboard'

function route (app: Router) {

  // CORS
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, PATCH, DELETE')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Max-Age', '86400')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, ' +
      'Content-Type, Accept, Authentication, Authorization, sess, apikey, X-Consumer-Username')

    if (req.method.toUpperCase() == 'OPTIONS') {
      res.statusCode = 204
      res.send()
      return
    }

    next()
  })

  app.use('/courses', courses)
  app.use('/', dashboard)
  
}

export default route