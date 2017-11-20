const mongoose = require('mongoose');

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
// tis will remove the depriciation error recieved in the terminal
  useMongoClient: true
});

module.exports = { mongoose }
