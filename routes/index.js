const express = require('express');
const router = express.Router();

const passport = require('passport');

const mongoose = require('mongoose');
const schema = require('./appSchema');
const User = schema.User;

/* checks if user is still logged in  */
function isLoggedIn(req, res, next) {
  console.log(`user is authenticated? ${req.isAuthenticated()}`);
  if(req.isAuthenticated()) {
    console.log("user is logged in");
    return next();
  }else
  console.log("user is not logged in");
  res.redirect('/login');
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home', { title: 'My Books - Welcome!' });
});

/* GET login form page. */
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Hello!' });
});

/* GET main page (after login) */
router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('main', { title: `Welcome User`});
});

/* GET profile page (after login) */
router.get('/profile', (req, res, next) => {
  res.render('profile', { title: 'User' });
});

/* GET signup form page */
router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Sign Up!' });
});

/* GET book page */
router.get('/book', (req, res, next) => {
  res.render('book', { title: 'Book' });
});

/* GET book page */
router.get('/addBook', (req, res, next) => {
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

/* POST user login */
router.post('/user-login', passport.authenticate('local', {
    //successRedirect: '/main',
    failureRedirect: '/login',
    failureMessage: "failed to login"
  }), (req, res) => {
    res.redirect('/main');
  });

/* POST logout */
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if(err) {
      console.log("failed to logout");
      return next(err);
    }
    console.log("logging out");
    res.redirect('/');
  })
})

module.exports = router;
