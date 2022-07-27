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

module.exports = router;
