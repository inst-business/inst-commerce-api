import { default as courses } from './courses'
import { default as site } from './site'

function route (app) {

  app.use('/courses', courses)
  app.use('/', site)
  
}

export default route