const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const schema = require('./appSchema');
const User = schema.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'My Books - Welcome!' });
});

/* GET login form page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Hello!' });
});

/* GET main page (after login) */
router.get('/main', function(req, res, next) {
  res.render('main', { title: 'Welcome User' });
});

/* GET profile page (after login) */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'User' });
});

/* GET signup form page */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up!' });
});

/* GET book page */
router.get('/book', function(req, res, next) {
  res.render('book', { title: 'Book' });
});

/* GET book page */
router.get('/addBook', function(req, res, next) {
  res.render('addBook', { title: 'Add Book' });
});

/* POST user signup */
/*Simple sign up. Will add validation later */
router.post('/user-signup', (req, res) => {
  console.log(`username: ${req.body.username}`);
  console.log(`password: ${req.body.password}`);
  console.log(`confirm password: ${req.body.confirm_password}`);
  
  const username = req.body.username;
  const password = req.body.password;
  const cPassword = req.body.confirm_password;
  
  const newUser = new User(req.body);


  newUser.save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });

  res.redirect('/signup');
});

module.exports = router;
