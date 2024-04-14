// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || user.password !== password) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }
      return done(null, user)
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

//將使用者物件中的重要屬性 id、name 和 email序列化後傳遞給 done 函式
passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})

// 準備引入路由模組
const todos = require('./todos')
const users = require('./users')



//第一個參數以'/todos'作為根路徑，所有導向'/todos'的請求都會再分發至第二個參數'todos'的文件
router.use('/todos', authHandler, todos)
router.use('/users', users)

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

// router.post('/login', (req, res) => {
//   return res.send(req.body)
// })
router.post('/login', passport.authenticate('local', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))


router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }

    return res.redirect('/login')
  })
})

// 匯出路由器
module.exports = router