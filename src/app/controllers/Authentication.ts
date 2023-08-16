import _ from '@/utils/utils'

class Authentication {

  // GET: /products
  static index (req: any, res: any) {
    res.render('dashboard.index')
  }

  // GET: /products/:slug
  static search (req: any, res: any) {
    console.log(req.query)
    res.render('search')
    // return res.send('search')
  }

}

export default Authentication