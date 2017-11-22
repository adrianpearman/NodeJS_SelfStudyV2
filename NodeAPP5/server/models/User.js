const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// ------ NEW USER ------- //
let UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

//--- Allows for the JSON call to be over ridden with what we want to be sent --//
// We use ES5 function declaration to get access to the 'this' variable
UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
}

//--- Allows for new instance methods to be added to the schema ---//
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();

  user.tokens.push({
    access: access,
    token: token
  })

  return user.save().then(() => {
    return token
  })
}

//--- Verifies the Token ---//
// static uses Model methods
UserSchema.statics.findByToken= function (token) {
  let User = this; //uses the whole User model
  let decoded

  try{
    decoded = jwt.verify(token, 'abc123')
  }catch(error){
    // Version 1
    // return new Promise((resolve, reject) => {
    //   reject()
    // })
    // Version 2 - refactored
    return Promise.reject()
  }

  return User.findOne({
    //the keys are rapped in quotes as they contain a period
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

//--- Verifies User Passwords and Email ---//
UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, res) => {
        if (res) {
          resolve(user)
        }else{
          reject()
        }
      })
    })

  })
}

// This will run before the new user is saved to the Database
// using password is salted through bcrypt middleware
UserSchema.pre('save', function (next) {
  let user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      })
    })
  }else {
    next()
  }
})

let User = mongoose.model('User', UserSchema)



module.exports = { User }
