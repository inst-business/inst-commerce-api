const express = require('express')
const newsController = require('../app/controllers/NewsController')

const router = express.Router()

router.use('/:slug', newsController.detail)
router.use('/', newsController.index)

module.exports = router