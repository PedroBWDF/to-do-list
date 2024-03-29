// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 準備引入路由模組
const todos = require('./todos')

//第一個參數以'/todos'作為根路徑，所有導向'/todos'的請求都會再分發至第二個參數'todos'的文件
router.use('/todos', todos)

router.get('/', (req, res) => {
  res.render('index')
})

// 匯出路由器
module.exports = router