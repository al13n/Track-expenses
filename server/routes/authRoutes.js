var express = require('express');
var route = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var config = require('../config');


route.post('/signup', function(req, res) {
  //var newuser = new user(req.body.data);
  User.findOne({
      username: req.body.username
  },function(err,user){
    if(err) throw err;
    console.log(user);
  	if(!user){
  		var newuser = new User(req.body);
  		newuser.save(function(err, user){
  			if(err) throw err;

  			var token = jwt.sign(user, config.secretkey, {
          		expiresIn: 5 // expires in 24*60*60 seconds
        	});
            
            console.log('New user signed up: ' + user );
        	res.json({success: true, message: 'New user created', token: token});
  		});
  	}
  	else
  		res.json({success: false, message: 'username exists!'});
  });

});

route.post('/login', function(req, res){
	User.find({username: req.body.username, 
		password: req.body.password},
		function(err, user){
			if(err) throw err;
			if(!user || user.length == 0){
				res.json({success: false, message: 'Wrong login credentials!'});
			}
			else{
			    console.log('User logged in: ' + user);
				var token = jwt.sign(user, config.secretkey, {
          			expiresIn: 5 // expires in 24*60*60 seconds
        		});

        		res.json({success: true, message: 'Successfully logged in', token: token});
			}
		}
	);
});

route.post('/authenticate', function(req, res){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //console.log(token);
  	if (token) {
    	jwt.verify(token, config.secretkey, function(err, decoded) {      
      		if (err) {
        		return res.json({ success: false, message: 'Token expired' });    
      		} 
      		else {
      			var username, user;
            try{
      			   if(decoded.constructor === Array){
      				    username = decoded[0].username;
      				    user = decoded[0];
      			   }
      			   else
      				   { username = decoded.username; user = decoded;}
                  console.log("Authenticate: " + user.username);
              //check if user exists
                User.findOne({username: user.username}, function(err, Newuser){
                  if(err) throw err;
                  console.log(Newuser.username);
                  if(!Newuser.username)
                    res.json({success: false, message: 'User does not exist!'});
                  else
                    res.json({success: true, username: Newuser.username, message: 'User authenticated'});
                });
        		  
            }
            catch(err) {
                throw err;
            }
      		}
    	});
	}
  else{
    res.json({success: false, message: 'Token does not exist'});
  }
});

module.exports = route;