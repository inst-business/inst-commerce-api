import express from 'express'
import { default as auth } from './auth'
import { default as users } from './users'
import { default as categories } from './categories'
import { default as products } from './products'
import { default as articles } from './articles'
import { default as dashboard } from './dashboard'

const router = express.Router()

router.use('/v1/a', auth)
router.use('/v1/u', users)
router.use('/v1/categories', categories)
router.use('/v1/products', products)
router.use('/v1/articles', articles)
router.use('/v1', dashboard)

export default router