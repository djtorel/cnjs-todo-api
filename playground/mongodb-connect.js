const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if(err) {
    return console.error(err)
  }
  console.log('Connected to MongoDB Server')

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false,
  // }, (err, result) => {
  //   if (err) {
  //     return console.error(err)
  //   }

  //   console.log(JSON.stringify(result.ops, null, 2))
  // })

  db.collection('Users').insertOne({
    name: 'Dominic',
    age: 36,
    location: 'Chandler',
  }, (err, result) => {
    if (err) {
      return console.error(err)
    }

    console.log(result.ops[0]._id.getTimestamp())
  })

  db.close()
})