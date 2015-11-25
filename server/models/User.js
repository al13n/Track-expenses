var config = require('../config');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user = {
		username: String,
		email: String,
		password: String, 
		realm: {type: String, default: config.USER_REGULAR}
};

module.exports = mongoose.model('User', new schema(user));
