// 引入外部套件
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// 建立基本參數
const port = 3000
const app = express()

// 引入自建modules
const URLs = require('./models/shortURL')
const generateShortUrl = require('./generate_short_URL')

// 使用express-handlebars為樣板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 使用body-parser和method-override
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // FIXME:好像可以不用？

// 建立mongoose連線
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () =>
  console.log('Error! mongoDB connect error.'))
db.once('open', () => {
  console.log('mongoDB connected!')
})

// 設定路由
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const shortKey = generateShortUrl()

  URLs.find({ originUrl: req.body.originUrl })
    .lean()
    .then(URL => {
      if (URL.length <= 0) {
        URLs.create({ originUrl: req.body.originUrl, shortUrl: generateShortUrl() })
          .then(() => URLs.find({ originUrl: req.body.originUrl }).lean())
          .then(URL => res.redirect(`/results/${URL[0]._id}`))
          .catch(error => console.error(error))
      } else {
        res.redirect(`/results/${URL[0]._id}`)
      }
    })
  })

  

app.get('/results/:id', (req, res) => {
  const id = req.params.id
  URLs.findById(id)
    .lean()
    .then(URL => res.render('result', { URL }))
})

app.get('/:short', (req, res) => {
  const shortURLInput = req.params.short

  URLs.find({ shortUrl: shortURLInput })
    .lean()
    .then(URL => res.redirect(URL[0].originUrl))
    .catch(error => console.error(error))
})

// 監聽路由
app.listen(port, () => {
  console.log(`Express is running on localhost:${port}`)
})
