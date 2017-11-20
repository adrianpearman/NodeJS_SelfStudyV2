const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

let todoID = '5a1235422981733113171ff6'
let userID = '5a0f31f8d90ccf886d552a7d'

if (!ObjectID.isValid(todoID) || !ObjectID.isValid(userID)) {
  console.log('ID is not valid');
}

//--- TODOS DB SEARCH ---//
// Todo.find({
//   _id: todoID
// }).then((todos) => {
//   console.log('Todos:', todos);
// })
//
// Todo.findOne({
//   _id: todoID
// }).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Tudo:', todo);
// })
//
//
// Todo.findById(todoID).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID:', todo);
// }).catch((error) => console.log(error))

//--- USER DB SEARCH ---//
User.find({
  _id: userID
}).then((users) => {
  return console.log('Users :', users);
})

User.findOne({
  _id: userID
}).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User:', user);
})

User.findById(userID).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User:', user);
}).catch((error) => console.log(error))
