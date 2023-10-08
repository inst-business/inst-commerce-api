import 'dotenv/config'
import 'module-alias/register'
import https from 'https'
import fs from 'fs'
import path from 'path'
import express from 'express'
// import bodyParser from 'body-parser'
// import session from 'express-session'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import { engine } from 'express-handlebars'
import morgan from 'morgan'
import Connect from '@/config/db/connect'
import routes from '@/routes'
// import jsonServer from 'json-server'
import { hbsHelpers } from '@/utils/viewEngine'
import { ENV, GV } from '@/config/global/const'

class Server {
  public static async run () {
    const app = express()

    // Connect to db
    await new Connect()

    // Middleware
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cookieParser())
    // app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(bodyParser.json())
    app.use(methodOverride('_method'))
    app.use(express.static(path.join(__dirname, '../public')))
    // app.use(express.static(path.join(__dirname, '../node_modules/bootstrap')))

    console.log(ENV.NODE_ENV + ' started!')
    if (ENV.NODE_ENV === 'development') {
      app.use(morgan('dev'))  // HTTP logger
    }
    
    // start session
    // app.use(session({
    //   secret: 'instance_dev_secret',
    //   resave: false,
    //   saveUninitialized: true,
    //   cookie: {
    //     secure: GV.COOKIE_SECURE,
    //     httpOnly: true,
    //     maxAge: 5 * GV._1M
    //   }
    // }))

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
      // console.log(`URL: ${req.url}`)
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
    app.disable('x-powered-by')   //  Hide techologies used from tracker (e.g. Wappalyzer)

    // Configure routes
    app.use(routes)

    // Fallback
    app.use('*', (req, res) => {
      res.status(404).end()
    })

    // Set up https
    // let server
    // try {
    //   server = https.createServer({
    //     key: fs.readFileSync(<string>ENV.SSL_KEY_PATH),
    //     cert: fs.readFileSync(<string>ENV.SSL_CERT_PATH),
    //   }, app)
    // }
    // catch (err: any) {
    //   console.error('SSL configurate failed:', err.message || err)
    //   server = app
    // }
    
    // Start server
    app.listen(ENV.PORT, () => {
      console.log(`(つ▀¯▀ )つ Listening on port: ${ENV.PORT}`)
    })
    
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