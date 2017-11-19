const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { User } = require('./models/User');
let { Todo } = require('./models/Todo');

let app = express();
const PORT = 3000

app.use(bodyParser.json()); //middleware used to send the request as json to the database

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (error) => {
    res.status(400).send(error)
  })
})

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

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})


module.exports = { app }
