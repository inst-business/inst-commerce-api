import express from 'express'
import 'module-alias/register'
import 'dotenv/config'
import fs from 'fs'
// import env from '@/config/env'
import Connect from '@/config/db/connect'
import morgan from 'morgan'
import path from 'path'
import { engine } from 'express-handlebars'
import route from '@/routes'
// import jsonServer from 'json-server'
import hbsHelpers from '@/utils/handlebars'
import methodOverride from 'method-override'

let ENV: any

class Server {
  public static async run () {
    // try {
    //   const { env } = require('@/config/env')
    //   ENV = (<any>env)[process.env.NODE_ENV ? process.env.NODE_ENV! : 'development']
    // } catch {
    //   ENV = process.env
    // }
    ENV = process.env

    const app = express()

    // Connect to db
    new Connect()

    // Middleware
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(methodOverride('_method'))
    app.use(express.static(path.join(__dirname, '../public')))
    app.use(express.static(path.join(__dirname, '../node_modules/bootstrap')))
    
    // HTTP logger
    // app.use(morgan('":remote-addr - :remote-user [:date[web]]" :method :url HTTP/:http-version :status :response-time ms - :res[content-length]'))
    app.use(morgan('dev'))
    
    // Template engine
    app.engine('hbs', engine({
      extname: '.hbs',
      helpers: hbsHelpers
    }))
    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, '../src', 'resources', 'views'))

    // CORS
    app.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', "*")
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
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
    
    // Configure routes
    route(app)
    
    // Start server
    app.listen(ENV.PORT, () =>
      console.log(`(つ▀¯▀ )つ Server is listening at ${ENV.PROTOCOL}://${ENV.HOST} on port: ${ENV.PORT}`)
    )
    
  }
}

Server.run()

// start DB server
// "start": "json-server --watch db.json",
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middleware = jsonServer.defaults()
// const db_port = process.env.PORT_DB || 7544
// server.use(middleware)
// server.use(router)
// server.listen(db_port)