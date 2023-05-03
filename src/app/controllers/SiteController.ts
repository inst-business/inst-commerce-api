class SiteController {

  // GET: /courses
  static index (req: any, res: any) {
    res.render('home')
  }

  // GET: /courses/:slug
  static search (req: any, res: any) {
    console.log(req.query)
    res.render('search')
    // return res.send('search')
  }

}

export default SiteController