const express = require('express');
const policies = require('./middleware/userpolicies');
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated } = require('./middleware/auth');

router.get('/login',forwardAuthenticated, function(req, res){
    res.render('users/login',{menu: '1' });
});

router.get('/register',forwardAuthenticated, (req, res)=>{
    res.render('users/register',{menu: '2' });
});

router.post('/register', policies, function(req, res){
    res.redirect('/users/login');
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/receipts',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
  


module.exports = router;