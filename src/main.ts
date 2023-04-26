import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { engine } from 'express-handlebars'
import route from './routes'
import { conn } from './config/db'
import jsonServer from 'json-server'

const app = express()
const api_port = process.env.PORT_API || 7543

app.use(express.static(path.join(__dirname, '../public')))

// Connect to db
conn()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// HTTP logger
// app.use(morgan('":remote-addr - :remote-user [:date[web]]" :method :url HTTP/:http-version :status :response-time ms - :res[content-length]'))
app.use(morgan('dev'))

// Template engine
app.engine('hbs', engine({
  extname: '.hbs',
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../src', 'resources', 'views'))

route(app)

app.listen(api_port, () => console.log(`example app listening at http://localhost:${api_port}`))



// start DB server
// "start": "json-server --watch db.json",
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middleware = jsonServer.defaults()
const db_port = process.env.PORT_DB || 7544
server.use(middleware)
server.use(router)
server.listen(db_port)