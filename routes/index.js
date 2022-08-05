var express = require('express');
var router = express.Router();

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

module.exports = router;
