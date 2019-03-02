const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

    /**next like local user model is called but not saved so we're gonna save it in the next line
     * There is also compatibility issues with the code in the course so this is updated
     * Note: I believe it to be backwards compatibilty although it might also be platform or os compatibility
     */
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    })
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

//Instance method - get called with individual doc
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // }); this is a longer version of the code down below to help understand wtf happens
        return Promise.reject(); 
        //This kinda makes it so you get error and next bit of code doesnt run
    }

    return User.findOne({
       '_id': decoded._id,
       'tokens.token': token,
       'tokens.access': 'auth' 
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    //TIL we are putting return cause we're putting a 'then' call
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            //use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    var user = this;
    //checking down below if pass is verified or changed
    if (user.isModified('password')) {
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}

//**Btw we're using regular functions here to gain access to the this binding */