const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

//把原本的'/todos'改成'/'，因為在index檔案已用'/todos'作為總路由
router.get('/', (req, res) => {
  //從URL獲取page參數再轉成數字
  const page = parseInt(req.query.page) || 1 
  const limit = 10
  const userId = req.user.id

  return Todo.findAll({
    //只傳送指定的id、name、isComplete
    attributes: ['id', 'name', 'isComplete'],
    where: { userId },
    offset: (page - 1) * limit,
    limit,
    raw: true
  })
    //res.render第二個參數定義的值在hbs用{{}}來取用
    .then((todos) => res.render('todos', {  
      todos, 
      // todos.slice((page - 1) * limit, page * limit),
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page
    }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
    //取得new.hbs裡面action屬性定義表單發送過來的資料
    const name = req.body.name 
    //passport透過反序列化將session資訊還原成使用者物件儲存在req.user
    const userId = req.user.id

    return Todo.create({ name, userId })
      .then(() => {
        req.flash('success', '新增成功!') //success為key(可自定義)，第2個參數為value
        return res.redirect('/todos')
      })
      .catch((error) => {
        error.errorMessage = '新增失敗:('
        next(error)
      })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }
      //確認資料庫儲存的userId是否等於登入後session儲存的userId
      if (todo.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/todos')
      }
      res.render('todo', { todo })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
    })

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true //返回JavaScript物件給樣板引擎而不是返回Sequelize Model instance
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }
      if (todo.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/todos')
      }

      res.render('edit', { todo })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.put('/:id', (req, res) => {
  const { name, isComplete } = req.body
  const id = req.params.id
  const userId = req.user.id

      return Todo.findByPk(id, {
        attributes: ['id', 'name', 'isComplete', 'userId']
      })
        .then((todo) => {
          if (!todo) {
            req.flash('error', '找不到資料')
            return res.redirect('/todos')
          }
          if (todo.userId !== userId) {
            req.flash('error', '權限不足')
            return res.redirect('/todos')
          }

          //若有勾選checkbox，則isComplete值為completed，判斷結果為true
          //已透過Todo.findByPk找到要更新的instance，所以下面用實例方法todo.update，而不用model update
          return todo.update({ name, isComplete: isComplete === 'completed' })
            .then(() => {
              //success為key(可自定義)，第2個參數為value
              req.flash('success', '更新成功!')
              return res.redirect(`/todos/${id}`)
            })
    })
    .catch((error) => {
      error.errorMessage = '更新失敗:('
      next(error)
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user.id

  // return Todo.destroy({ where: { id } })
  //   .then(() => {
  //     req.flash('success', '刪除成功!') //success為key(可自定義)，第2個參數為value
  //     return res.redirect('/todos')

      return Todo.findByPk(id, {
        attributes: ['id', 'name', 'isComplete', 'userId']
      })
        .then((todo) => {
          if (!todo) {
            req.flash('error', '找不到資料')
            return res.redirect('/todos')
          }
          if (todo.userId !== userId) {
            req.flash('error', '權限不足')
            return res.redirect('/todos')
          }

          return todo.destroy()
            .then(() => {
              req.flash('success', '刪除成功!')
              return res.redirect('/todos')
            })
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router