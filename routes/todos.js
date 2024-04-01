const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

//把原本的'/todos'改成'/'，因為在index檔案已用'/todos'作為總路由
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10

  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'], //只傳送指定的id、name、isComplete
    raw: true
  })
    .then((todos) => res.render('todos', {  //res.render第二個參數定義的值在hbs用{{}}來取用
      todos: todos.slice((page - 1) * limit, page * limit),
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
    const name = req.body.name //取得new.hbs裡面action屬性定義表單發送過來的資料

    return Todo.create({ name })
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

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
    })

router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true //返回JavaScript物件給樣板引擎而不是返回Sequelize Model instance
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.put('/:id', (req, res) => {
  const { name, isComplete } = req.body
  const id = req.params.id

  //若有勾選checkbox，則isComplete值為completed，判斷結果為true
  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('success', '更新成功!') //success為key(可自定義)，第2個參數為value
      return res.redirect(`/todos/${id}`)
    })
    .catch((error) => {
      error.errorMessage = '更新失敗:('
      next(error)
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Todo.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!') //success為key(可自定義)，第2個參數為value
      return res.redirect('/todos')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router