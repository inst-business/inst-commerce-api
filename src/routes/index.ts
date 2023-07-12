import express, { Router } from 'express'
import { default as courses } from './courses'
import { default as dashboard } from './dashboard'

function route (app: Router) {

  app.use('/v1/courses', courses)
  app.use('/v1', dashboard)
  
}

export default route