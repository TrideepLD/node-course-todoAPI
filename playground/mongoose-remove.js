const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findOneAndRemove({_id: '5c6565fcd5b65da2027453ae'}).then((todo) => {
    console.log(todo);
    
})

Todo.findByIdAndRemove('5c6565fcd5b65da2027453ae').then((todo) => {
    console.log(todo);
});