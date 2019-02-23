const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

/**There is a situation where the tests wont pass and therefore there are 2 options:
 * 1) In config.js u can change localhost to 127.0.0.7
 * 2) In package.json you can make the mocha test server time out to be like so mocha --timeout 10000 server/sdsa
 */

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {expect(res.body.text).toBe(text);})
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.text).toBe(todos[0].text)
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexID = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexID}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123abc')
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
      var hexId = todos[1]._id.toHexString();
      
      request(app)
          .delete(`/todos/${hexId}`)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo._id).toBe(hexId);
          })
          .end((err, res) => {
              if (err) {
                  return done(err);
              }

              /** what happens below is actually quering database using findById and then checking to see if it exist
               * In the course it says to use toNotExist but you have to use toBeFalsy or not.toBeTruthy() due to upgraded api.
               */
              Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();
                done();
              }).catch((e) => done(e));

          });
  });

  it('should return 404 if todo not found', (done) => {
    var hexID = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexID}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .delete('/todos/123abc')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    //grab id of first item
    var hexId = todos[0]._id.toHexString();
    var text = 'Changed Text';
    

    request(app)
    .patch(`/todos/${hexId}`)
    //update text, set completed true
    .send({
      completed: true,
      text
    })
    // 200
    .expect(200)
    // text is changed, completed is true, completedAt is a number .toBeA
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of second todo item
    var hexId = todos[1]._id.toHexString();
    var text = 'Text Updated';
    
    request(app)
    .patch(`/todos/${hexId}`)
    // update text, set completed to false
    .send({
      completed: false,
      text
    })
    // 200
    .expect(200)
    //text is changed, completed is false, completedAt is null .toNotExist or as we learnt its diff func now.
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeNull();
    })
    .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authorized', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'abc123!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err) {
        return done(err);
      }

      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      });
    });
  });

  it('should return validation errors if request is invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: 'and',
      password: '123'
    })
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: '123!Password'
    })
    .expect(400)
    .end(done);
  });
})
