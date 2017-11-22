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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(TODOS.length)
      })
      .end(done)
  })
})

//--- Testing: GETTING SPECIFIC TODOS ---//
describe('GET /todos/:id', () => {
  it('should return todo document', (done) => {
    request(app)
    .get(`/todos/${TODOS[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(TODOS[0].text)
    }).end(done)
  })

  it('should return 404 if not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/:${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if non-object ids', (done) => {
    request(app)
    .get('/todos/kjbcsjh')
    .expect(404)
    .end(done)
  })
})

//--- Testing: DELETING TODOS ---//
describe('DELETE /todos/:id', () => {
  it('should remove as todo', (done) => {
    let hexId = TODOS[2]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
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

  it('should return 404 if todo is not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/:${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .delete('/todos/kjbcsjh')
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

  it('should clear completedAt when todo is not completed', (done) => {
    let hexID = TODOS[1]._id.toHexString()
    let text = 'this should be the new text!!!'

    request(app)
    .patch(`/todos/${hexID}`)
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
      })
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
