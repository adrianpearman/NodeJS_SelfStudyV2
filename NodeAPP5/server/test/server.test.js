const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/Todo');

const TODOS = [
  {text: 'test',
  _id: new ObjectID()},
  {text: 'test',
  _id: new ObjectID()},
  {text: 'test',
  _id: new ObjectID()},
  {text: 'test',
  _id: new ObjectID()}
]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(TODOS)
  }).then(() => done())
})

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
