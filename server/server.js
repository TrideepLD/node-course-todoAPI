require('./config/config')

const jwt = require('jsonwebtoken');
const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/**The snippet of code down below to to post things */
//POST todos/
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

/** Snippet ddown below to the get or fetch the data */
//GET todos/
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET todos/:id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    /**One way to write this below */

    // Todo.findById(id).then((todos) => {
    //     res.send({todos})
    //     if (!todos) {
    //         return res.status(404).send();//Note to send error without body you type it like this oryou know, remove the 'e' in .send()
    //     } else {console.log('Todo By Id', todos);}
    // }, (e) => {
    //     res.status(400).send(e);
    // }).catch((e) => res.status(400).send());

    /**Second way to write this code below */

    Todo.findById(id).then((todos) => {
        if (!todos) {
            return res.status(404).send();
        }
        res.send({todos});
    }).catch((e) => res.status(400).send());
});

/**Delete the things by id
 * DELETE /todos/:id
 */
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => res.status(400).send());

    // remove todo by id
        //success
            //if no doc, send 404
            //if doc, send doc back with a 200
        //error
            // sending back 400 with emoty body
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    //why lodash was added is down below
    var body = _.pick(req.body, ['text', 'completed']);//Created as it has a subset of thing sent to us

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }   else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(400).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});


// POST /users
//Fucking checking to see if I just retype the whole thing will it work now
//Whatd'ya know that works

app.post('/users', (req, res) => {
    //use pick method
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    
    

    return user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**Choosing the port */
app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};





/**everything below is just something else slightly connected to the app
 * its not really of much concern as of now.
 * Also needs to be look at again and understood in a weeks time
 * just like the rest of the code.
 */
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


