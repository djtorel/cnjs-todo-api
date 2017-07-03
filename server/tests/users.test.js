const { app } = require('../server')

const expect = require('expect')
const request = require('supertest').agent(app.listen())
// const { ObjectID } = require('mongodb')

const { User } = require('../models/user')
const { users, populateUsers } = require('./seed/seed')

describe('Testing user routes', () => {
  // beforeEach(populateUsers)
  describe('GET /users/me', () => {
    before(populateUsers)
    it('should return user if authenticated', (done) => {
      request
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString())
          expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })

    it('should return a 401 if noth authenticated', (done) => {
      const errObj = {
        type: 'HTTP Error 401',
        message: 'Unauthorized: Access is denied due to invalid credentials',
      }
      request
        .get('/users/me')
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual(errObj)
        })
        .end(done)
    })
  })

  describe('POST /users', () => {
    it('should create a user', (done) => {
      const email = 'mochatest@test.com'
      const password = '123mnb!'

      request
        .post('/users')
        .send({ email, password })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist()
          expect(res.body._id).toExist()
          expect(res.body.email).toBe(email)
        })
        .end((err) => {
          if (err) {
            return done(err)
          }

          User.findOne({ email }).then((user) => {
            expect(user).toExist()
            expect(user.password).toNotBe(password)
            done()
          }).catch(e => done(e))
        })
    })

    it('should return a validation error if request is invalid', (done) => {
      request
        .post('/users')
        .send({ email: '12@3', password: '123' })
        .expect(400)
        .end(done)
    })

    it('should not create a user if email in use', (done) => {
      request
      .post('/users')
      .send({ email: 'test@test.com', password: 'userOnePass' })
      .expect(400)
      .end(done)
    })
  })

  describe('POST /users/login', () => {
    beforeEach(populateUsers)
    it('should login user and return auth token', (done) => {
      request
        .post('/users/login')
        .send({ email: users[1].email, password: users[1].password })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth'],
            })
            done()
          }).catch(e => done(e))
        })
    })

    it('should reject invalid login', (done) => {
      request
        .post('/users/login')
        .send({ email: users[1].email, password: 'incorrectPassword' })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist()
        })
        .end((err) => {
          if (err) {
            return done(err)
          }
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1)
            done()
          }).catch(e => done(e))
        })
    })
  })

  describe('DELETE /users/me/token', () => {
    before(populateUsers)
    it('should remove auth token on logout', (done) => {
      request
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err) => {
          if (err) {
            return done(err)
          }

          User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0)
            done()
          }).catch(e => done(e))
        })
    })
  })
})
