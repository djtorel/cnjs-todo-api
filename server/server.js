require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos })
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404)
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.sendStatus(404)
    }
    return res.status(200).send({ todo })
    // eslint-disable-next-line no-unused-vars
  }).catch(e => res.status(400).send({ type: e.name, message: e.message }))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404)
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.sendStatus(404)
    }
    return res.status(200).send({ todo })
  }).catch(e => res.status(400).send({ type: e.name, message: e.message }))
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404)
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      return res.sendStatus(404)
    }
    return res.send({ todo })
  }).catch(e => res.status(400).send({ type: e.name, message: e.message }))
})

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  const user = new User(body)

  user.save().then(() => user.generateAuthToken())
  .then((token) => {
    res.header('x-auth', token).send(user)
  }).catch(e => res.status(400).send({ type: e.name, code: e.code, message: e.message }))
})

app.listen(port, () => {
  console.log(`App started on port ${port}`)
})

module.exports = { app }
