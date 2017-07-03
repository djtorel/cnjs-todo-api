const { ObjectID } = require('mongodb')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todo')
const { User } = require('../server/models/user')

// const id = '59592a7bac686f30cb60ed5c'

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   _id: id,
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id,
// }).then((todo) => {
//   console.log('Todo', todo)
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.error('Id not found')
//   }
//   return console.log('Todo By Id', todo)
// }).catch(e => console.log(e.message))

// User.findById
const userId = '595851029622105c43dd3b6b'

User.findById(userId).then((user) => {
  if (!user) {
    return console.error('Unable to find user')
  }
  return console.log(JSON.stringify(user, null, 2))
}).catch(e => console.log(e.message))
