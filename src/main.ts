import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import 'module-alias/register'
import Connect from '@/config/db/connect'
import { ENV, GV } from '@/config/global/const'
import morgan from 'morgan'
import path from 'path'
import { engine } from 'express-handlebars'
import route from '@/routes'
// import jsonServer from 'json-server'
import hbsHelpers from '@/utils/handlebars'
import methodOverride from 'method-override'

class Server {
  public static async run () {
    // try {
    //   const { env } = require('@/config/env')
    //   ENV = (<any>env)[process.env.NODE_ENV ? process.env.NODE_ENV! : 'development']
    // } catch {
    //   ENV = process.env
    // }
    const app = express()

    // Connect to db
    await new Connect()

    // Middleware
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(methodOverride('_method'))
    app.use(express.static(path.join(__dirname, '../public')))
    app.use(express.static(path.join(__dirname, '../node_modules/bootstrap')))
    app.use(morgan('dev'))  // HTTP logger
    // app.use(morgan('":remote-addr - :remote-user [:date[web]]" :method :url HTTP/:http-version :status :response-time ms - :res[content-length]'))
    
    // start session
    app.use(session({
      secret: 'instance_dev_secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: GV.COOKIE_SECURE,
        httpOnly: true,
        maxAge: 5 * GV._1M
      }
    }))

    // Template engine
    const viewEngineConfig = {
      extname: '.hbs',
      helpers: hbsHelpers,
      defaultLayout: 'main.hbs'
    }
    app.engine('hbs', engine(viewEngineConfig))
    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, '../src', 'resources', 'views'))

    app.all('*', (req, res, next) => {
      console.log(`URL: ${req.url}`)
      if (!req.body === null) {
        console.log(JSON.stringify(req.body, null, 2))
      }
      next()
    })
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