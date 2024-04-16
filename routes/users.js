const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

router.post('/', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!email || !password) {
    req.flash('error', 'email 及密碼為必填')
    res.redirect('/register')
  }

  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    res.redirect('/register')
  }

  return User.count({ where: { email } })
  .then((rowCount) => {
    //Sequelize count方法會回傳符合的資料筆數，大於0表示有符合的email
    if (rowCount > 0) {
      req.flash('error', '此email已註冊')
      return
    }

    return bcrypt.hash(password, 10)
      .then((hash) => User.create({ email, name, password: hash }))
  })

  //確保user被新增到DB
  .then((user) => {
    if (!user) {
      return res.redirect('back')
    }

    req.flash('success', '註冊成功')
    return res.redirect('/login')
  })

  .catch((error) => {
    error.errorMessage = '註冊失敗'
    next(error)
  })

  // return res.send(req.body)
})

module.exports = router