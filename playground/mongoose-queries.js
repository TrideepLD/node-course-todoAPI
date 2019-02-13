const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
//use User.findByID 

var id = '5c40e1edc26bb650e45be9dc';

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Unable to find user');  
    }

    console.log(JSON.stringify({user}, null, 2));
}).catch((e) => console.log(e));

// var id = '5c491e762b64cd52f8ebd4f611';
// var text = "First test todo";

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     text: text
// }).then((todos) => {
//     console.log('Todos', todos);
// });
// console.log();
// console.log();


// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found');
        
//     }
//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));