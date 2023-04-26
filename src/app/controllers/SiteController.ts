class SiteController {

  // GET: /courses
  static index (req, res) {
    res.render('home')
  }

  // GET: /courses/:slug
  static search (req, res) {
    console.log(req.query)
    res.render('search')
  }

}

export default SiteController