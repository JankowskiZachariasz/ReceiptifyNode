const express = require('express');
const path = require('path');
const router = express.Router();
const Product = require('../models/products');
const { ensureAuthenticated, forwardAuthenticated } = require('./middleware/auth');

router.get('/', ensureAuthenticated, function(req, res){

    Product.find({owner:req._passport.session.user}).exec(function (err, prods){

        if(err)console.log(err);
        else res.render('products',{menu:"4", prods});

    });

    
});

router.get('/public', ensureAuthenticated, function(req, res){

    Product.find({}).exec(function (err, prods){

        if(err)console.log(err);
        else res.render('productsPublic',{menu:"4", prods});

    });

    
});

router.post('/create', ensureAuthenticated, function(req, res){

    var r = new Product({

        name: "empty",
        receiptName: "nowprod_1",
        owner: req._passport.session.user,
        company: "Unknown",
        fats: "??",
        carbo: "??",
        calories: "??",

    });
    r.save();
    res.redirect('/products');
   
});

router.post('/update/:idR', ensureAuthenticated, function(req, res){

    Product.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        console.log(req.body);
        if(req.body.name == '')req.body.name=c.name;
        if(req.body.receiptName == '')req.body.receiptName=c.receiptName;
        if(req.body.fats =='')req.body.fats=c.fats;
        if(req.body.carbo =='')req.body.carbo=c.carbo;
        if(req.body.calories =='')req.body.calories=c.calories;


        c.name=req.body.name;
        c.receiptName=req.body.receiptName;
        c.fats=req.body.fats;
        c.carbo=req.body.carbo;
        c.calories=req.body.calories;

        c.save();

        res.redirect('/products/get/'+req.params.idR);
    });
   
});

router.post('/remove/:idR', ensureAuthenticated, function(req, res){

    Product.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }

        c.deleteOne();
        res.redirect('/products');
    });
   
});

router.get('/get/:idR', ensureAuthenticated, function(req, res){

    Product.find({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, prods){

        if(err)console.log(err);
        else res.render('productView',{menu:"4", prods});

    });
});

router.get('/getPublic/:idR', ensureAuthenticated, function(req, res){

    Product.find({_id:req.params.idR}).exec(function (err, prods){

        if(err)console.log(err);
        else res.render('productsPublicView',{menu:"4", prods});

    });
});
module.exports = router;