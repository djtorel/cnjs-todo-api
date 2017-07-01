const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if(err) {
    return console.error(err)
  }
  console.log('Connected to MongoDB Server')

  // db.collection('Todos').find({
  //   _id: new ObjectID('5956fce72239782134c147e0')
  // }).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, null, 2))
  // }, (err) => {
  //   console.error(err)
  // })
  
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`)
  // }, (err) => {
  //   console.error(err)
  // })

  db.collection('Users').find({name: 'Dominic'}).toArray().then(item => {
    console.log(JSON.stringify(item, null, 2))
  }, err => {
    console.error(err)
  })

  // db.close()
})