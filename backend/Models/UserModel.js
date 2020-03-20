

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: {
        type: String,
        Required: 'Please enter'
    },
    lastname: {
        type: String,
        Required: 'Please enter'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
      },
    email: {
        type: String,
        Required: 'Please enter'
    },
    password: {
        type: String,
        Required: 'Please enter'
    },
    Created_date:{
        type: Date,
        default :Date.now
    },

});

module.exports = mongoose.model('Users', UserSchema);