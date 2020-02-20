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

router.get('/get/:idR', ensureAuthenticated, function(req, res){

    Receipt.find({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, receipts){

        if(err)console.log(err);
        else res.render('receiptView',{menu:"3", receipts});

    });
});

router.post('/update/:idR', ensureAuthenticated, function(req, res){

    Receipt.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        console.log(req.body);
        if(req.body.company == '')req.body.company=c.company;
        else {
            //adding new company if needed
            Company.find({name: req.body.company, owner: req._passport.session.user}).exec(function (err, com){

                if(err) console.log(err);
                    
                if(com.length == 0){
                    var r = new Company({
                        name: req.body.company,
                        company: "XYZ Ltd.",
                        owner: req._passport.session.user,
                        status: "Awaits implementation",  
                    });
                    r.save();
                    
                }
    
    
    
            }); 

        }
        if(req.body.total == '')req.body.total=c.total;
        if(req.body.date =='')req.body.date=c.date;

        c.date=req.body.date;
        c.company=req.body.company;
        c.total=req.body.total;

        c.save();

        res.redirect('/receipts/get/'+req.params.idR);
    });
   
});


router.get('/product/remove/:idR/:idP', ensureAuthenticated, function(req, res){

    Receipt.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        c.products.splice(req.params.idP,1)
        c.prices.splice(req.params.idP,1)
        c.quantities.splice(req.params.idP,1)
        c.ids.splice(req.params.idP,1)
        c.save();

        res.redirect('/receipts/get/'+req.params.idR);
    });
   
});

router.post('/product/add/:idR', ensureAuthenticated, function(req, res){

    Receipt.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        if(req.body.product != ''){

            if(req.body.price=='' || typeof req.body.price === 'undefined')req.body.price='empty';
            if(req.body.quantity=='' || typeof req.body.quantity === 'undefined')req.body.quantity='empty';



            var id = "empty";

        //if the product doesn't exist create a datapoint
        Product.find({receiptName: req.body.product, company: c.company}).exec(function (err, prods){

            if(err){
                console.log(err);
                
            }    
            if(prods.length == 0){
                var r = new Product({
                    name: "empty",
                    receiptName: req.body.product,
                    owner: req._passport.session.user,
                    company: c.company,   
                });
                r.save();
                
                c.ids.push(r.id);
                id=r.id;
                console.log(r.id);
            }

            else {
                console.log(prods[0].id);
                c.ids.push(prods[0].id);
                id=prods[0].id;
            }

            c.products.push(req.body.product);
            c.prices.push(req.body.price);
            c.quantities.push(req.body.quantity);
            console.log("oto id: " + id);
            c.save();
    
            res.redirect('/receipts/get/'+req.params.idR);

        }); 
    }
        

    });
   
});

router.post('/remove/:idR', ensureAuthenticated, function(req, res){

    Receipt.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }

        c.deleteOne();
        res.redirect('/receipts');
    });
   
});

router.post('/create', ensureAuthenticated, function(req, res){

    var r = new Receipt({

        date: "12.12.12",
        company: "unknown",
        total: "unknown",
        owner: req._passport.session.user,
        photo: "unknown"

    });
    r.save();
    res.redirect('/receipts');
   
});

module.exports = router;