const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/Todo');
const { User } = require('./../models/User');
const { TODOS, populateTodos, USERS, populateUsers } = require('./seed/seed')

beforeEach(populateTodos)
beforeEach(populateUsers)
//--- Testing: CREATING TODOS ---//
describe('POST /todos', () => {
  it('should test todo text', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', USERS[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', USERS[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(TODOS.length)
          done()
        }).catch((error) => done(error))
      })
  })
});

//--- Testing: GETTING TODOS ---//
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)
  })
})

//--- Testing: GETTING SPECIFIC TODOS ---//
describe('GET /todos/:id', () => {
  it('should return todo document', (done) => {
    request(app)
    .get(`/todos/${TODOS[0]._id.toHexString()}`)
    .set('x-auth', USERS[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(TODOS[0].text)
    }).end(done)
  })

  it('should not return todo document of other user', (done) => {
    request(app)
    .get(`/todos/${TODOS[0]._id.toHexString()}`)
    .set('x-auth', USERS[1].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return 404 if not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/:${hexId}`)
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 if non-object ids', (done) => {
    request(app)
    .get('/todos/kjbcsjh')
    .set('x-auth', USERS[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
})

//--- Testing: DELETING TODOS ---//
describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = TODOS[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((error, res) => {
        if (error) {
          return done(error)
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((error) => done(error));
      })
  })

  it('should not remove a todo if not user', (done) => {
    let hexId = TODOS[0]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(404)
      .end((error, res) => {
        if (error) {
          return done(error)
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((error) => done(error));
      })
  })

  it('should return 404 if todo is not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/:${hexId}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .delete('/todos/kjbcsjh')
    .set('x-auth', USERS[1].tokens[0].token)
    .expect(404)
    .end(done)
  })
})

//--- Testing: UPDATING TODOS ---//
describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let hexID = TODOS[0]._id.toHexString()
    let text = 'this should be the new text'

    request(app)
    .patch(`/todos/${hexID}`)
    .set('x-auth', USERS[0].tokens[0].token)
    .send({
      completed: true,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text)
      expect(res.body.todo.completed).toBe(true)
      expect(res.body.todo.completedAt).toBeA('number')
    })
    .end(done)
  })

  it('should not update the todo of another user', (done) => {
    let hexID = TODOS[0]._id.toHexString()
    let text = 'this should be the new text'

    request(app)
    .patch(`/todos/${hexID}`)
    .set('x-auth', USERS[1].tokens[0].token)
    .send({
      completed: true,
      text: text
    })
    .expect(404)
    .end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    let hexID = TODOS[1]._id.toHexString()
    let text = 'this should be the new text!!!'

    request(app)
    .patch(`/todos/${hexID}`)
    .set('x-auth', USERS[1].tokens[0].token)
    .send({
      completed: false,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text)
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toNotExist()
    })
    .end(done)
  })
})

//--- Testing: PRIVATE ROUTES ---//
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(USERS[0]._id.toHexString())
        expect(res.body.email).toBe(USERS[0].email)
      })
      .end(done)
  })

  it('should return 404 if user is not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})


//--- Testing: CREATING USERS ---//
describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'testtest@test.com'
    let password = 'password123'

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist()
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email)
    })
    .end((error) => {
      if (error) {
        return done(error)
      }

      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password)
        done()
      }).catch((error) => done(error))
    })
  });

  it('should return validation error if request is invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: 'kajhskjh',
      password: 'sjdjhds'
    })
    .expect(400)
    .end(done)
  });

  it('should not create user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({
      email: USERS[0].email,
      password: 'kjsdlad'
    })
    .expect(400)
    .end(done)
  });
})

describe('POST /users/login', () => {
  it('should login and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: USERS[1].email,
      password: USERS[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist()
    })
    .end((error, res) => {
      if (error) {
        return done(error)
      }

      User.findById(USERS[1]._id).then((user) => {
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        })
        done()
      }).catch((error) => done(error))
    })
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: USERS[1].email,
      password: 'jhgjffghj'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist()
    })
    .end((error, res) => {
      if (error) {
        return done(error)
      }

      User.findById(USERS[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1)
        done()
      }).catch((error) => done(error))
  });
  })
})

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', USERS[0].tokens[0].token)
    .expect(200)
    .end((error, res) => {
      if (error) {
        return done(error)
      }

      User.findById(USERS[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0)
        done()
      }).catch((error) => done(error))
    })

  });
})
