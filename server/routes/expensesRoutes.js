var express = require('express');
var route = express.Router();
var Expense = require('../models/Expense');
var Middleware = require('./middleware');


route.use(Middleware);

route.get('/', function(req,res){

	var username = req.decoded.username;
	console.log(username);
	Expense.find({username: username }, function(err, expenses){
		if(err) throw err;
		else{

			return res.json({success: true, expenses: expenses});
		}

	});
})
.get('/:id', function(req, res){
	var username = req.decoded.username;
	Expense.find({username: username, _id: req.params.id }, function(err, expenses){
		if(err) throw err;
		else{
			return res.json({success: true, expenses: expenses});
		}

	});
})
.post( '/', function(req, res){
	var username = req.decoded.username;
	console.log(req.body);
	var newExpense = new Expense({
		username: username, 
		date: req.body.date,
		amount: req.body.amount,
		description: req.body.description,
		comment: req.body.comment
	});
	newExpense.save(function(err, expense){
		if(err){
			throw err;
		}
		console.log("\nExpense added: " + expense + "\n");
		res.json({success: true, message: "Expense saved"});
	});
})

.delete('/:id', function(req, res){
	var username = req.decoded.username;

	Expense.remove({username: username, _id: req.params.id }, function(err, expense){
		if(err) throw err;
		else{
			console.log("\nExpense deleted: " + expense + "\n");
			return res.json({success: true, message: "Expense deleted"});
		}

	});
})

.put('/:id', function(req,res){
	var username = req.decoded.username;
	var id = req.params.id;
	Expense.update({username: username, _id: id}, req.body, {multi: true}, function(err, expense){
		console.log("\nExpense updated: " + expense + "\n");
		return res.json({success: true, message: "Expense updated"});
	});
});

module.exports = route;



