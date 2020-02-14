const express = require('express');
const path = require('path');
const router = express.Router();
const Receipt = require('../models/receipts');
const { ensureAuthenticated, forwardAuthenticated } = require('./middleware/auth');

router.get('/', function(req, res){

    Receipt.find({}).exec(function (err, receipts){

        if(err)console.log(err);
        else res.render('receipts',{menu:"3", receipts});

    });

    
});

router.get('/get/:idR', function(req, res){

    Receipt.find({_id:req.params.idR}).exec(function (err, receipts){

        if(err)console.log(err);
        else res.render('receiptView',{menu:"3", receipts});

    });
});

router.post('/update/:idR', function(req, res){

    Receipt.findOne({_id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        console.log(req.body);
        if(req.body.company == '')req.body.company=c.company;
        if(req.body.total == '')req.body.total=c.total;
        if(req.body.date =='')req.body.date=c.date;

        c.date=req.body.date;
        c.company=req.body.company;
        c.total=req.body.total;

        c.save();

        res.redirect('/receipts/get/'+req.params.idR);
    });
   
});


router.get('/product/remove/:idR/:idP', function(req, res){

    Receipt.findOne({_id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        c.products.splice(req.params.idP,1)
        c.prices.splice(req.params.idP,1)
        c.quantities.splice(req.params.idP,1)
        c.save();

        res.redirect('/receipts/get/'+req.params.idR);
    });
   
});

router.post('/product/add/:idR', function(req, res){

    Receipt.findOne({_id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        if(req.body.product != ''){

            if(req.body.price=='' || typeof req.body.price === 'undefined')req.body.price='empty';
            if(req.body.quantity=='' || typeof req.body.quantity === 'undefined')req.body.quantity='empty';

        c.products.push(req.body.product)
        c.prices.push(req.body.price)
        c.quantities.push(req.body.quantity)
        }

        c.save();

        res.redirect('/receipts/get/'+req.params.idR);
    });
   
});

router.post('/remove/:idR', function(req, res){

    Receipt.findOne({_id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }

        c.deleteOne();
        res.redirect('/receipts');
    });
   
});

router.post('/create', function(req, res){

    var r = new Receipt({

        date: "12.12.12",
        company: "unknown",
        total: "unknown",
        photo: "unknown"

    });
    r.save();
    res.redirect('/receipts');
   
});

module.exports = router;