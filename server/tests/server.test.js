const { app } = require('../server')

const expect = require('expect')
const request = require('supertest').agent(app.listen())
const { ObjectID } = require('mongodb')

const { Todo } = require('../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
}]

beforeEach((done) => {
  Todo.remove({}).then(() => (
    Todo.insertMany(todos)
  )).then(() => done())
})


describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text'
    request
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        Todo.find({ text }).then((foundTodos) => {
          expect(foundTodos.length).toBe(1)
          expect(foundTodos[0].text).toBe(text)
        }).catch(e => done(e))
        return done()
      })
  })

  it('should not create todo with invalid body data', (done) => {
    request
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err)
        }

        Todo.find().then((foundTodos) => {
          expect(foundTodos.length).toBe(2)
        }).catch(e => done(e))
        return done()
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo not found', (done) => {
    request
      .get(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request
      .get('/todos/123')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString()

    request
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist()
        }).catch(e => done(e))
        return done()
      })
  })
  it('should return 404 if todo not found', (done) => {
    request
      .delete(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    request
      .delete('/todos/123')
      .expect(404)
      .end(done)
  })
})
