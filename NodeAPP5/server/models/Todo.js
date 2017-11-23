const mongoose = require('mongoose')

// ------ NEW TODOS ------- //
// creating the model for the documents to be saved
let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 2,
    trim: true  // removes unneccary trailling and leading spaces
  },
  completed: {
    type: Boolean,
    // required: true
    required: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    required: true,
    //allows for the Todo to be associated with a specific User
    type: mongoose.Schema.Types.ObjectId
  }
})

// let newTodo = new Todo({
//   text: 'Cook Dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log(doc);
// }, (err) => {
//   console.log(err);
// })
//
// let otherTodo = new Todo({
//   text: 'Get out of bed',
//   completed: true,
//   completedAt: 894
// })
//
// otherTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (error) => {
//   console.log('Unable to save document', err);
// })

module.exports = { Todo }
