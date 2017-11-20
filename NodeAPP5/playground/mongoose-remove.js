const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

let todoID = '5a131e8b4ef18b4abc13a003'
let userID = '5a0f31f8d90ccf886d552a7d'

//--- This will delete everything from the database ---//
// Todo.remove({}).then((result) => {
//   console.log(result);
// })

//--- similar to findByIdAndRemove but will alllow to query by multiple objects ---//
// Todo.findOneAndRemove({_id: todoID}).then((doc) => {
//   console.log(doc);
// })

//--- This will delete a specific document with a given ID ---///
// Todo.findByIdAndRemove(todoID).then((doc) => {
//   console.log(doc);
// })
