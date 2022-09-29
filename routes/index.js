const express = require('express');
const router = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const schema = require('./appSchema');
const User = schema.User;
const Book = schema.Book;

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("storage upload");
    cb(null, __dirname + '/uploads');
  },
  filename: (req, file, cb) => {
    console.log("in filename");
    cb(null, file.fieldname+'_'+ Date.now());
  }
});

const upload = multer({storage: storage});


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
  console.log(`current user: ${req.user.username}`);
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
  
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  const cPassword = req.body.confirm_password.trim();

  //create new user
  // - check if username is already taken
  // - check if password and confirm password match
  // - save new user into database 
 
  User.findOne({username: username}, (err, user) => {
    if(err) {return next(err); }

    //create a new user
    if(!user) {
      //check to see if password is the same as confirm password 
      if(password != cPassword) {
        console.log("passwords do not match!");
        return res.redirect('/signup');
        //pass error to view
      }else{
        //save new user into DB
        const newUser = new User(req.body);
  
        bcrypt.genSalt(10, (err, salt) => {
          if(err) { return next(err); }

          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) { return next(err); }

            newUser.password = hash;
            //save user into DB
            newUser.save((err, newUser) => {
              if(err) { return next(err); }
              req.logIn(newUser, (err) => {
                if(err) { return next(err); }
                console.log("successful registration...loging in");
                return res.redirect('/main');
              
              });

            });
          });
        });

      }

    }else {
     //there already is a user with that username 
     console.log("that username is already taken!");
     //send error to view
     return res.redirect('/signup');
    }

  });

});

/* POST user login */
router.post('/user-login', passport.authenticate('local', {
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

/* POST upload image */
router.post('/add-review', upload.single('book_pic'), (req, res, next) => {
  console.log("in add review making book var");
  console.log(`file name: ${req.file.filename}`);

  let book = new Book({
    title: req.body.book_title,
    author: req.body.author,
    rating: req.body.rating,
    comment: req.body.comment, 
    bookimg: {
      data: fs.readFileSync(__dirname + '/uploads/' + req.file.filename),
      contentType: 'image/png'
    },
    creator: req.user.username
  });
  
  book.save()
    .then(b =>{
      console.log(`book saved: ${b.creator}`);
      console.log(`curr logged in user: ${req.user.username}`);
      User.findOne({username: req.user.username}, (err, user) => {
        if(user){
          console.log(`user found for book save: ${user}`);
          user.books.push(b._id);
          user.save(err => {
            if(err) {return next(err); }
            res.redirect('/main');
          });
        }else{
          console.log('could not find user!');
          res.redirect('/main');
        }
      });
    })
    .catch(err => {
      return next(err);
    });
  /*
  book.save((err, book) => {
    if(err) { 
        console.log(`error in saving book: ${err}`);
        return next(err); 
    }
      res.redirect('/main');
  });
  */
});

module.exports = router;
