import express from 'express'
import siteController from '../app/controllers/SiteController'

const router = express.Router()

router.get('/search', siteController.search)
router.get('/', siteController.index)

// app.post('/search', (req, res) => {
//   console.log(req.body)
//   res.send('')
// })

export default router