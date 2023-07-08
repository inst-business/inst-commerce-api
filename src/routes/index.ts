import express, { Router } from 'express'
import { default as courses } from './courses'
import { default as dashboard } from './dashboard'

function route (app: Router) {

  app.use('v1/', () => {
    app.use('/courses', courses)
    app.use('/', dashboard)
  })
  
}

export default route