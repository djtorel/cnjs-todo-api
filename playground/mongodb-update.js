const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if(err) {
    return console.error(err)
  }
  console.log('Connected to MongoDB Server')

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5957f764568845b12aea71de')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then(result => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5957f88e4d3abd0401d73142')
  }, {
    $set: {
      name: 'Dominic'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then(result => {
    console.log(result)
  })

  // db.close()
})