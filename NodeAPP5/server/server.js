const express = require('express');
const bodyParser = require('body-parser');
const _ =require('lodash')

let {ObjectID} = require('mongodb')
let { mongoose } = require('./db/mongoose');
let { User } = require('./models/User');
let { Todo } = require('./models/Todo');

let app = express();
const PORT = process.env.PORT || 4000

app.use(bodyParser.json()); //middleware used to send the request as json to the database

//--- TODOS GET ALL REQUESTS ---//
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (error) => {
    res.status(400).send(error)
  })
})

//--- TODOS POST REQUEST ---//
app.post('/todos', (req, res) => { //this will create a new todo when the post request is sent
  console.log(req.body);
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc)
  }, (error) => {
    // res.send(error)
    res.status(400).send(error) //will return an error message with the proper http code
  })
})

//--- TODOS GET ONE REQUEST ---//
app.get('/todos/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(400).send()
    }
  res.send({todo})
  }).catch((error) => {
    res.status(400).send()
  })
})

//--- TODOS DELETE ONE REQUEST ---//
app.delete('/todos/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(400).send()
    }
    res.send({todo})
    // return console.log(JSON.stringify(todo, undefined, 2));
  }).catch((error) => {
    res.status(400).send()
  })
})

//--- TODOS PATCH A DOCUMENT  ---//
app.patch('/todos/:id', (req, res) => {
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo})
  }).catch((error) => {
    res.status(404).send()
  })
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})


module.exports = { app }
