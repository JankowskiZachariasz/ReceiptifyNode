const express = require('express');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Product = require('../models/products');
const Receipt = require('../models/receipts');
const Company = require('../models/companies');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ensureAuthenticated, forwardAuthenticated } = require('./middleware/auth');

router.get('/', function(req, res){

    console.log("another connections!");

res.sendStatus(200);

    
});


router.post('/api/posts', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

router.post('/login', (req, res) => {
  
    console.log({another: req.body});

    User.findOne({
        email: req.body.email
      }).then(user => {
        if (!user) {
            res.sendStatus(404);
        }
        console.log(user);

        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            jwt.sign({user}, 'secretkey', { expiresIn: '120s' }, (err, token) => {
                res.json({
                  token
                });
              });
          } else {
            res.sendStatus(404);
          }
        });
    });
});





// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

module.exports = router;