import express from 'express'
import { default as users } from './users'
import { default as categories } from './categories'
import { default as products } from './products'
import { default as dashboard } from './dashboard'

const router = express.Router()

router.use('/v1/categories', categories)
router.use('/v1/products', products)
router.use('/v1/u', users)
router.use('/v1', dashboard)

export default router