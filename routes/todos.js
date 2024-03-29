const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res) => {
  try {
    return Todo.findAll({
      attributes: ['id', 'name', 'isComplete'], //只傳送指定的id、name、isComplete
      raw: true
    })
      .then((todos) => res.render('todos', { todos, message: req.flash('success'), error: req.flash('error') }))
      //存取成功就顯示message；出現錯誤就顯示error
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.get('/new', (req, res) => {
  try {
    return res.render('new', { error: req.flash('error') })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.post('/', (req, res) => {
  try {
    const name = req.body.name //取得new.hbs裡面action屬性定義表單發送過來的資料

    return Todo.create({ name })
      .then(() => {
        req.flash('success', '新增成功!') //success為key(可自定義)，第2個參數為value
        return res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '新增失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '新增失敗:(')
    return res.redirect('back')
  }
})

router.get('/:id', (req, res) => {
  try {
    const id = req.params.id

    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('todo', { todo, message: req.flash('success') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.get('/:id/edit', (req, res) => {
  try {
    const id = req.params.id

    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true //返回JavaScript物件給樣板引擎而不是返回Sequelize Model instance
    })
      .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.put('/:id', (req, res) => {
  try {
    const { name, isComplete } = req.body
    const id = req.params.id

    return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
      //若有勾選checkbox，則isComplete值為completed，判斷結果為true
      .then(() => {
        req.flash('success', '更新成功!') //success為key(可自定義)，第2個參數為value
        return res.redirect(`/todos/${id}`)
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '更新失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id

    return Todo.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '刪除成功!') //success為key(可自定義)，第2個參數為value
        return res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '刪除失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '刪除失敗:(')
    return res.redirect('back')
  }
})

module.exports = router