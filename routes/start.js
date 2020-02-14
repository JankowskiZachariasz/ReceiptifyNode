const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', function(req, res){

    if (!req.isAuthenticated()) {
        res.redirect('/users/login'); 
      }
    else       
    res.redirect('/receipts');  
     

});

module.exports = router;