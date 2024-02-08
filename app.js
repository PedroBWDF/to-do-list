const express = require('express')
const app = express()

const { engine } = require('express-handlebars')

//取用models資料夾的。index.js檔案的邏輯中會取用todo.js的modelName
const db = require('./models')
const Todo = db.Todo

const port = 3000
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index')
})

//測試應用程式與資料庫之間的連線
app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos', (req, res) => {
  res.send('get all todos')
})

app.get('/todos/new', (req, res) => {
  res.send('create todo')
})

app.post('/todos', (req, res) => {
  res.send('add todo')
})

app.get('/todos/:id', (req, res) => {
  res.send(`get todo: ${req.params.id}`)
})

app.get('/todos/:id/edit', (req, res) => {
  res.send(`get todo edit: ${req.params.id}`)
})

app.put('/todos/:id', (req, res) => {
  res.send('modify todo')
})

app.delete('/todos/:id', (req, res) => {
  res.send('delete todo')
})

app.listen(3000, () => {
  console.log('App is running on port 3000')
})