const { app } = require('../server')

const expect = require('expect')
const request = require('supertest').agent(app.listen())

const { Todo } = require('../models/todo')

beforeEach((done) => {
  Todo.remove({}).then(() => done())
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

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
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

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0)
        }).catch(e => done(e))
        return done()
      })
  })
})
