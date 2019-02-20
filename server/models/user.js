const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '(VALUE) is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
       access: {
        type: String,
        required: true
       } ,
       token: {
        type: String,
        required: true
       }
    }]
});

/**Method down below is to carefully select what you want displayed. */
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//UserSchema.methods is an object
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    //next like local user model is called but not saved so we're gonna save it in the next line
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    })
};

var User = mongoose.model('User', UserSchema);

module.exports = {User}