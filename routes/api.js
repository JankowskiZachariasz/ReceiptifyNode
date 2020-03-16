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
const {verifyToken} = require('./middleware/verifyToken');

router.get('/', function(req, res){

    console.log("another connections!");

res.sendStatus(200);
    
});


router.post('/receipt', verifyToken, (req, res) => { 
  
        var data = JSON.parse(req.body);
        
        var r = new Receipt({

            date: data.date,
            company: data.retailer,
            total: data.total,
            owner: req.authData.user._id,
            photo: "unknown"
    
        });
        r.save();
        res.json({id: r.id });
});



router.post('/login', (req, res) => {
  
    var data = JSON.parse(req.body);
    User.findOne({
        email: data.email
      }).exec(function (err, user){

        if (err) res.sendStatus(403);
        else{
        bcrypt.compare(data.password, user.password, (err, isMatch) => {
          if (err) res.sendStatus(500);
          if (isMatch) {

            jwt.sign({user}, 'secretkey', { expiresIn: '60s' }, (err, token) => {

                if (err) res.sendStatus(500);

                res.json({ token }); });
          } 
          else { res.sendStatus(403); }
        });
      }
    });
});





// FORMAT OF TOKEN
// Authorization: Bearer <access_token>



module.exports = router;