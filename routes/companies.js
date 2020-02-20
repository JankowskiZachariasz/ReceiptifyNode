const express = require('express');
const path = require('path');
const router = express.Router();
const Company = require('../models/companies');
const { ensureAuthenticated, forwardAuthenticated } = require('./middleware/auth');

router.get('/', ensureAuthenticated, function(req, res){

    Company.find({owner:req._passport.session.user}).exec(function (err, com){

        if(err)console.log(err);
        else res.render('companies',{menu:"5", com});

    });

    
});

router.get('/public', ensureAuthenticated, function(req, res){

    Company.find({}).exec(function (err, com){

        if(err)console.log(err);
        else res.render('companiesPublic',{menu:"5", com});

    });

    
});

router.post('/create', ensureAuthenticated, function(req, res){

    var r = new Company({

        name: "New Company",
        company: "XYZ Ltd.",
        owner: req._passport.session.user,
        status: "Awaits implementation",

    });
    r.save();
    res.redirect('/companies');
   
});

router.post('/update/:idR', ensureAuthenticated, function(req, res){

    Company.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }
        console.log(req.body);
        if(req.body.name == '')req.body.name=c.name;
        if(req.body.company == '')req.body.company=c.company;


        c.name=req.body.name;
        c.company=req.body.company;

        c.save();

        res.redirect('/companies/get/'+req.params.idR);
    });
   
});

router.post('/remove/:idR', ensureAuthenticated, function(req, res){

    Company.findOne({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, c){

        if(err){
            console.log(err);
            res.sendStatus(404);
        }

        c.deleteOne();
        res.redirect('/companies');
    });
   
});

router.get('/get/:idR', ensureAuthenticated, function(req, res){

    Company.find({owner:req._passport.session.user, _id:req.params.idR}).exec(function (err, com){

        if(err)console.log(err);
        else res.render('companiesView',{menu:"5", com});

    });
});

router.get('/getPublic/:idR', ensureAuthenticated, function(req, res){

    Company.find({_id:req.params.idR}).exec(function (err, com){

        if(err)console.log(err);
        else res.render('companiesPublicView',{menu:"5", com});

    });
});
module.exports = router;