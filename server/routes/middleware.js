var config = require('../config');
var jwt = require('jsonwebtoken');
var User = require('../models/User');

function middleware(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secretkey, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        //console.log(decoded);
        if(decoded.constructor === Array)
          req.decoded = decoded[0];    
        else
          req.decoded = decoded;
        
        //Check if such a user exists: scenario where user is deleted, and token is still valid
        User.find(req.decoded, function(err, user){
          if(err) throw err;
          if(!user){
            return res.json({ success: false, message: 'No such user exists.' }); 
          }
          else
            next();    
        });
        
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}


module.exports = middleware;