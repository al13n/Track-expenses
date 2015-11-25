var express = require('express');
var route = express.Router();
var User = require('../models/User');
var Expense = require('../models/Expense');
var Middleware = require('./middleware');
var config = require('../config');

route.use(Middleware);
route.use(isUserManager);

route.get('/', function(req, res){
		User.find({}, function(err, users){
			if(err) throw err;
			else{
				res.json({success: true, users: users});
			}
		});
})
.delete('/:id', function(req, res){
		User.find({_id: req.params.id}, function(err, user){
			if(err) throw err;
			if(!user){
				res.json({success: false, message: "No such user exists!"});
			}
			else{
				console.log("To be deleted: " + user);
				Expense.find({username: user[0].username}, function(err){
					if(err) throw err;
				}).remove(function(err){
					if(err) throw err;	
				});

				User.find({_id: user[0]._id}).remove(function(err){
					if(err) throw err;
					else{
						console.log("User : " + user[0].username + " deleted by "+ req.decoded.username);
						return res.json({success: true, message: "User deleted"});
					}
				});
			}
		});
})
.post('/makeadmin/:id', function(req, res){
		User.update({_id: req.params.id}, {realm: config.USER_MANAGER}, {multi: true}, function(err, user){
			console.log("\n Made admin, updated id: " + req.params.id + "\n");
			return res.json({success: true, message: "User updated"});
		});
})
.post('/removeadmin/:id', function(req, res){
		User.update({_id: req.params.id}, {realm: config.USER_REGULAR}, {multi: true}, function(err, user){
			console.log("\n User removed as admin, updated id: " + req.params.id + "\n");
			return res.json({success: true, message: "User updated"});
		});
});


function isUserManager(req, res, next){
	User.findOne({username: req.decoded.username}, function(err, user){
		if(err) throw err;
		console.log(user + " " + user.username + " " + user.realm);
		if(user.realm == config.USER_MANAGER){
			next();
		}
		else{
			res.json({success: false, message: "Not Authorized"});
		}
	});
}

module.exports = route;