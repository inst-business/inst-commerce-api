import express, { Router } from 'express'
import { default as products } from './products'
import { default as dashboard } from './dashboard'

function route (app: Router) {

  app.use('/v1/products', products)
  app.use('/v1', dashboard)
  
}

export default route