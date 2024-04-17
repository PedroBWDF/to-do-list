// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

// const bcrypt = require('bcryptjs')

// const db = require('../models')
// const User = db.User

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//   //取得Facebook的email跟顯示名稱
//   profileFields: ['email', 'displayName']
// }, (accessToken, refreshToken, profile, done) => {
//   //用戶可能不只一個email，取主要的
//   const email = profile.emails[0].value
//   const name = profile.displayName

//   return User.findOne({
//     attributes: ['id', 'name', 'email'],
//     where: { email },
//     raw: true
//   })
//     .then((user) => {
//       //若user用臉書登錄過，即回傳給done函式
//       if (user) return done(null, user)

//       //若無，隨機創建一組密碼
//       const randomPwd = Math.random().toString(36).slice(-8)

//       return bcrypt.hash(randomPwd, 10)
//         //密碼加密後儲存在DB
//         .then((hash) => User.create({ name, email, password: hash }))
//         //返回給done函式
//         .then((user) => done(null, { id: user.id, name: user.name, email: user.email }))
//     })
//     .catch((error) => {
//       error.errorMessage = '登入失敗'
//       done(error)
//     })
//   //下方教案再進行實作

// }))

// //scope做為應用程式向FB取得資料的權限範圍
// router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

// router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
//   successRedirect: '/todos',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
//   return User.findOne({
//     attributes: ['id', 'name', 'email', 'password'],
//     where: { email: username },
//     raw: true
//   })
//     .then((user) => {
//       if (!user) {
//         return done(null, false, { message: 'email 或密碼錯誤' })
//       }

//       // 第一個參數放入要比對的明文，第二個參數則是資料庫中的雜湊值
//       return bcrypt.compare(password, user.password)
//         .then((isMatch) => {
//           if (!isMatch) {
//             return done(null, false, { message: 'email 或密碼錯誤' })
//           }

//       // if (!user || user.password !== password) {
//       //   return done(null, false, { message: 'email 或密碼錯誤' })
//       // }
//           return done(null, user)
//         })
//     })
//     .catch((error) => {
//       error.errorMessage = '登入失敗'
//       done(error)
//     })
// }))

// //將使用者物件中的重要屬性 id、name 和 email序列化後傳遞給 done 函式
// passport.serializeUser((user, done) => {
//   const { id, name, email } = user
//   return done(null, { id, name, email })
// })

// passport.deserializeUser((user, done) => {
//   done(null, { id: user.id })
// })


const root = require('./root')
const oauth = require('./oauth')
// 準備引入路由模組
const todos = require('./todos')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')


router.use('/', root)
router.use('/oauth', oauth)
//第一個參數以'/todos'作為根路徑，所有導向'/todos'的請求都會再分發至第二個參數'todos'的文件
router.use('/todos', authHandler, todos)
router.use('/users', users)

// router.get('/', (req, res) => {
//   res.render('index')
// })

// router.get('/register', (req, res) => {
//   return res.render('register')
// })

// router.get('/login', (req, res) => {
//   return res.render('login')
// })

// // router.post('/login', (req, res) => {
// //   return res.send(req.body)
// // })
// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/todos',
//   failureRedirect: '/login',
//   failureFlash: true
// }))


// router.post('/logout', (req, res) => {
//   req.logout((error) => {
//     if (error) {
//       next(error)
//     }

//     return res.redirect('/login')
//   })
// })

// 匯出路由器
module.exports = router