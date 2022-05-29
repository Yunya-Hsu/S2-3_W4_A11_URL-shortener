// 引入外部套件
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// 建立基本參數
const port = 3000
const app = express()

// 引入自建modules
const Shorten = require('./models/shortURL')
const generateShortUrl = require('./generate_short_URL')

// 使用express-handlebars為樣板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 使用body-parser和method-override
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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

// 監聽路由
app.listen(port, () => {
  console.log(`Express is running on localhost:${port}`)
})
