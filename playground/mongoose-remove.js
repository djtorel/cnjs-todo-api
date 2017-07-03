const { ObjectID } = require('mongodb')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todo')
const { User } = require('../server/models/user')

// Todo.remove({}).then((result) => {
//   console.log(result)
// })

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove('5959685f29584e1c3a24369c').then((todo) => {
  console.log(JSON.stringify(todo, null, 2))
})