const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

const passport = require('passport')
// require('dotenv').config()
// console.log(process.env)

//取用dotenv設定檔
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.NODE_ENV)

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const router = require('./routes') // 引用路由器
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
const port = 3000

//取用models資料夾的。index.js檔案的邏輯中會取用todo.js的modelName
// const db = require('./models')
// const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
//Express獲取傳送來的表單資料需要額外設定

app.use(methodOverride('_method'))
//HTML原生的form方法只能讓browser使用GET和POST來提交資料，要用PUT，需要method-override套件

app.use(session({
  secret: process.env.SESSION_SECRET, //透過環境變數取得
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(passport.initialize())

app.use(messageHandler)
app.use(router)// 將 request 導入路由器
app.use(errorHandler)

app.listen(3000, () => {
  console.log(`App is running on <http://localhost>:${port}`)
})

// app.get('/', (req, res) => {
//   res.render('index')
// })

// //測試應用程式與資料庫之間的連線
// app.get('/todos', (req, res) => {
//   try {
//     return Todo.findAll({
//       attributes: ['id', 'name', 'isComplete'], //只傳送指定的id、name、isComplete
//       raw: true
//     })
//       .then((todos) => res.render('todos', { todos, message: req.flash('success'), error: req.flash('error') }))
//       //存取成功就顯示message；出現錯誤就顯示error
//       .catch((error) => {
//         console.error(error)
//         req.flash('error', '資料取得失敗:(')
//         return res.redirect('back')
//       })
//   } catch (error) {
//     console.error(error)
//     req.flash('error', '伺服器錯誤')
//     return res.redirect('back')
//   }
// })

// app.get('/todos/new', (req, res) => {
//   try {
//     return res.render('new', { error: req.flash('error') })
//   } catch (error) {
//     console.error(error)
//     req.flash('error', '伺服器錯誤')
//     return res.redirect('back')
//   }
// })

// app.post('/todos', (req, res) => {
//   try {
//     const name = req.body.name //取得new.hbs裡面action屬性定義表單發送過來的資料

//     return Todo.create({ name })
//       .then(() => {
//         req.flash('success', '新增成功!') //success為key(可自定義)，第2個參數為value
//         return res.redirect('/todos')
//       })
//       .catch((error) => {
//         console.error(error)
//         req.flash('error', '新增失敗:(')
//         return res.redirect('back')
//       })

//   } catch (error) {
//     console.error(error)
//     req.flash('error', '新增失敗:(')
//     return res.redirect('back')
//   }
// })

// app.get('/todos/:id', (req, res) => {
//   try {
//     const id = req.params.id

//     return Todo.findByPk(id, {
//       attributes: ['id', 'name', 'isComplete'],
//       raw: true
//     })
//       .then((todo) => res.render('todo', { todo, message: req.flash('success') }))
//       .catch((error) => {
//         console.error(error)
//         req.flash('error', '資料取得失敗:(')
//         return res.redirect('back')
//       })
//   } catch (error) {
//     console.error(error)
//     req.flash('error', '伺服器錯誤')
//     return res.redirect('back')
//   }
// })

// app.get('/todos/:id/edit', (req, res) => {
//   try {
//     const id = req.params.id

//     return Todo.findByPk(id, {
//       attributes: ['id', 'name', 'isComplete'],
//       raw: true//返回JavaScript物件給樣板引擎而不是返回Sequelize Model instance
//     })
//       .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
//       .catch((error) => {
//         console.error(error)
//         req.flash('error', '資料取得失敗:(')
//         return res.redirect('back')
//       })
//   } catch (error) {
//     console.error(error)
//     req.flash('error', '伺服器錯誤')
//     return res.redirect('back')
//   }
// })

// app.put('/todos/:id', (req, res) => {
//   try {
//     const { name, isComplete } = req.body
//     const id = req.params.id

//     return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } }) //若有勾選checkbox，則isComplete值為completed，判斷結果為true
//       .then(() => {
//         req.flash('success', '更新成功!') //success為key(可自定義)，第2個參數為value
//         return res.redirect(`/todos/${id}`)
//       })
//       .catch((error) => {
//         console.error(error)
//         req.flash('error', '更新失敗:(')
//         return res.redirect('back')
//       })
//   } catch (error) {
//     console.error(error)
//     req.flash('error', '更新失敗:(')
//     return res.redirect('back')
//   }
// })

// app.delete('/todos/:id', (req, res) => {
//   try {
//     const id = req.params.id

//     return Todo.destroy({ where: { id } })
//       .then(() => {
//         req.flash('success', '刪除成功!') //success為key(可自定義)，第2個參數為value
//         return res.redirect('/todos')
//       })
//       .catch((error) => {
//         console.error(error)
//         req.flash('error', '刪除失敗:(')
//         return res.redirect('back')
//       })
//   } catch (error) {
//     console.error(error)
//     req.flash('error', '刪除失敗:(')
//     return res.redirect('back')
//   }
// })