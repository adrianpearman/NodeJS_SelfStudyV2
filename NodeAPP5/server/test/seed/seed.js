const { ObjectID } = require('mongodb')
const { Todo } = require('./../../models/Todo');
const { User } = require('./../../models/User');
const jwt = require('jsonwebtoken')

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

const USERS = [
{_id: userOneID,
  email: 'test1@test.com',
  password: 'password1',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
}]},
{_id: userTwoID,
email: 'test2@test.com',
password: 'password2'
}]

const TODOS = [
  {text: 'test',
  completed: true,
  completedAt: 222,
  _id: new ObjectID()},
  {text: 'test',
  completed: true,
  completedAt: 222,
  _id: new ObjectID()},
  {text: 'test',
  completed: true,
  completedAt: 222,
  _id: new ObjectID()},
  {text: 'test',
  completed: true,
  completedAt: 222,
  _id: new ObjectID()}
]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(TODOS)
  }).then(() => done())
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(USERS[0]).save();
    let userTwo = new User(USERS[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

module.exports = { TODOS, populateTodos, USERS, populateUsers }
