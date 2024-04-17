const express = require('express')
const router = express.Router()
const passport = require('passport')

//scope做為應用程式向FB取得資料的權限範圍
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router