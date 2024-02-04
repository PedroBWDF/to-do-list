const express = require('express')
const app = express()

//取用models資料夾的。index.js檔案的邏輯中會取用todo.js的modelName
const db = require('./models')
const Todo = db.Todo

app.get('/', (req, res) => {
  res.send('hey')
})

//測試應用程式與資料庫之間的連線
app.get('/todos', (req, res) => {
  return Todo.findAll()
    .then((todos) => res.send({ todos }))
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