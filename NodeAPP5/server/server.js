require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const _ =require('lodash')
const {ObjectID} = require('mongodb')

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/Todo');
let { User } = require('./models/User');
let { authenticate } = require('./middlewares/authenticate')

let app = express();
const PORT = process.env.PORT

app.use(bodyParser.json()); //middleware used to send the request as json to the database

//--- TODOS GET ALL REQUESTS ---//
app.get('/todos',authenticate, (req, res) => {
  Todo.find({_creator: req.user._id})
  .then((todos) => {
    res.send({todos})
  }, (error) => {
    res.status(400).send(error)
  })
})

//--- TODOS POST REQUEST ---//
app.post('/todos', authenticate, (req, res) => { //this will create a new todo when the post request is sent
  console.log(req.body);
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc)
  }, (error) => {
    // res.send(error)
    res.status(400).send(error) //will return an error message with the proper http code
  })
})

//--- TODOS GET ONE REQUEST ---//
app.get('/todos/:id',authenticate, (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user.id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
  res.send({todo})
  }).catch((error) => {
    res.status(400).send()
  })
})

//--- TODOS DELETE ONE REQUEST ---//
app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo})
    // return console.log(JSON.stringify(todo, undefined, 2));
  }).catch((error) => {
    res.status(400).send()
  })
})

//--- TODOS PATCH A DOCUMENT  ---//
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id
  let body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user.id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo})
  }).catch((error) => {
    res.status(404).send()
  })
})

//--- USERS ---//
//--- Creating a new user ---//
app.post('/users', (req, res) => { //this will create a new user when the post request is sent
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((error) => {
    res.status(400).send(error)
  })
})

//--- Authenticating the x-auth header ---//
app.get('/users/me',authenticate, (req, res) => {
  res.send(req.user)
})

//--- Logging in a user ---//
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((error) => {
    res.status(400).send()
  })
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})

//--- Deleting the token ---//
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }, () => {
    res.status(400).send()
  })
})


module.exports = { app }
