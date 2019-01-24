var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

//resource collection below
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp')

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     }, completed: {
//         type: Boolean,
//         default: false
//     }, completedAt: {
//         type: Number,
//         deffault: null
//     }
// });

// var newTodo = new Todo({
//     text: '   Smth     '
// });

// newTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
//     console.log('Todo was saved');
// }, (e) => {
//     console.log('Unable to save todo');
// });


// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     }
// });

// var newDB = new User({
//     email: '   asdf@123.com     '
// });

// newDB.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
//     console.log('Todo was saved');
// }, (e) => {
//     console.log('Unable to save todo', e);
// });


