var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

//GET todos
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

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};





/**everything below is just something else slightly connected to the app
 * its not really of much concern as of now.
 * Also needs to be look at again and understood in a weeks time
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


