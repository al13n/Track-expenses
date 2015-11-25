var mongoose = require('mongoose');
var schema = mongoose.Schema;

var expense = {
		username: String,
		date: { type:Date, default: Date.now },
		amount: { type: Number, default: 0}, 
		description: {type: String, default: ''}, 
		comment: {type: String,  default: ''},
		timestamp: { type: Date, default: Date.now }
};

module.exports = mongoose.model('Expense', new schema(expense));
