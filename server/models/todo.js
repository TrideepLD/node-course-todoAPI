var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }, completed: {
        type: Boolean,
        default: false
    }, completedAt: {
        type: Number,
        deffault: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
//for _creator we can name this whatever we want but using _ to show that it is an object ID
module.exports = {Todo};