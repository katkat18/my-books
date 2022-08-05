var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'My Books - Welcome!' });
});

/* GET login page. */
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

/* GET signup page */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up!' });
});

module.exports = router;
