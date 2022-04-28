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


module.exports = router;
