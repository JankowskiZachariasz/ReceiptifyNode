const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const start = require('./routes/start');
const receipts = require('./routes/receipts');
const users = require('./routes/users');
const companies = require('./routes/companies');
const products = require('./routes/products');
const port = 8080;
const mongoose = require('mongoose');
const MONGO_USERNAME = 'sammy';
const MONGO_PASSWORD = 'your_password';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'sharkinfo';
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
mongoose.connect(url, {useNewUrlParser: true},(err)=>{console.log('connected to db!')});


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('wwwroot'))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
require('./routes/middleware/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//routes
app.use('/', start);
app.use('/receipts', receipts);
app.use('/users', users);
//app.use('/companies', companies);
//app.use('/products', products);
app.listen(port, function () {
  console.log('Example app listening on port 8080!');


});

