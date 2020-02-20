const express = require('express');
const path = require('path');
const router = express.Router();
const Product = require('../models/products');
const Receipt = require('../models/receipts');
const Company = require('../models/companies');
const { ensureAuthenticated, forwardAuthenticated } = require('./middleware/auth');

router.get('/', ensureAuthenticated, function(req, res){

    Receipt.find({owner:req._passport.session.user}).exec(function (err, receipts){

        if(err)console.log(err);
        else res.render('receipts',{menu:"3", receipts});

    });

    
});


module.exports = router;