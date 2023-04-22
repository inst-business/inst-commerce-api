class NewsController {

  // GET: /news
  index (req, res) {
    res.render('news')
  }

  // GET: /news/:slug
      detail (req, res) {
    console.log(req.query)
    res.send('DETAIL')
    res.render('news')
  }

}

module.exports = new NewsController