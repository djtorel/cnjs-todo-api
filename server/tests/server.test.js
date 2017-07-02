const { app } = require('../server')

const expect = require('expect')
const request = require('supertest').agent(app.listen())

const { Todo } = require('../models/todo')

const todos = [{
  text: 'First test todo',
}, {
  text: 'Second test todo',
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
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
