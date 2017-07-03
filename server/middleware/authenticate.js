const { User } = require('../models/user')

const authenticate = (req, res, next) => {
  const token = req.header('x-auth')

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject({ name: 'HTTP Error 401', message: 'Unauthorized: Access is denied due to invalid credentials' })
    }

    req.user = user
    req.token = token
    next()
  }).catch(e => res.status(401).send({ type: e.name, code: e.code, message: e.message }))
}

module.exports = { authenticate }
