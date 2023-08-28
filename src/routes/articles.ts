import express from 'express'
import ArticleController from '@controllers/ArticleController'
import { IArticle } from '@models/Article'
import Auth from '@middlewares/Authenticate'
import { R } from '@/config/global/const'
import _ from '@/utils/utils'

const router = express.Router()