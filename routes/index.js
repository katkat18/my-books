const express = require('express');
const router = express.Router();
const path = require('path');

const passport = require('passport');
const bcrypt = require('bcryptjs');

const schema = require('./appSchema');
const User = schema.User;
const Book = schema.Book;

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname+'_'+ Date.now());
  }
});

const upload = multer({storage: storage});

/* check if user is logged in; prevent users from accessing pages without proper authentication */
function checkLogin(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }else{
  res.redirect('/login');
  }
}

/* checks if user is logged in. If so, redirect accordingly to user main page */
function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()){
    res.redirect('/main');
  }else{
    return next();
  }
}

router.get('/', isLoggedIn, async (req, res, next) => {
  try{
    const books = await Book.find({});

    if(books){
      res.render('home', {title: 'My Books - Welcome!', 'user_books': books});
    }else{
      res.render('home', { title: 'My Books - Welcome!' });
    }
  } catch (err) {
    return next(err);
  }
});

router.get('/search', async (req, res, next) => {
  console.log(`search: ${req.query.search}`);

  const query = req.query.search.toLowerCase().trim();

  const results = await Book.find({
      "$or": [
        {title: query},
        {author: query},
        {creator: query}
      ]
  });

  if(query.length === 0){
    console.log(`string was empty`);
    res.redirect('/');
  
  }else if(results.length > 0){
    console.log(`results were found: ${results.length}`);
    res.render('home', {title: 'My Books - Welcome!', 'user_books': results});
    
  }else{
    console.log(`no results were found`);
    res.render('home', { title: 'My Books - Welcome!', 'user_books': results, 'no_results': `Sorry, no results were found for your search: ${query}`});
  }

});

/* GET login form page. */
router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login', { title: 'Hello!' });
});

/* GET main page (after login) */
router.get('/main', checkLogin, async (req, res, next) => {
  try {
    const books = await Book.find({});

    if(books) {
      res.render('main', {title: `Welcome ${req.user.username}`, 'username': req.user.username, 'user_books': books});
    }else{
      res.render('main', { title: `Welcome User`});
    }
  } catch(err) {
    return next(err);
  }
});

/* GET profile page (after login) */
router.get('/profile', checkLogin, async(req, res, next) => {
  try {
    const books = await Book.find({creator: req.user.username});

    if(books) {
      res.render('profile', {title: `${req.user.username}`, 'username': req.user.username, 'profile_pic': req.user.profileimg, 'user_books': books});
    }else{
      res.render('profile', { title: `${req.user.username}` });
    }
  }catch(err){
    return next(err);
  }
});

/* GET edit profile page (after login) */
router.get('/edit-books', checkLogin, async(req, res, next) => {
  try {
    const books = await Book.find({creator: req.user.username});

    if(books) {
      res.render('edit_profile_books', {title: `${req.user.username}`, 'username': req.user.username, 'profile_pic': req.user.profileimg, 'user_books': books});
    }else{
      res.render('edit_profile_books', { title: `${req.user.username}` });
    }
  }catch(err){
    return next(err);
  }
});


/* GET signup form page */
router.get('/signup', isLoggedIn, (req, res) => {
  res.render('signup', { title: 'Sign Up!' });
});

/* GET book page */
router.get('/book:id', async(req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if(book){
      res.render('book', {title: `${book.creator}'s Review`, 'book': book});
    }else{
      //add error page
      res.render('error', { title: 'Error' });
    }
  }catch(err){
    return next(err);
  }
});

/* GET book page */
router.get('/book', (req, res, next) => {
  res.render('book', { title: 'Add Book' });
});

/* POST user signup */
/*Simple sign up. Will add validation later */
router.post('/user-signup', async(req, res) => {
  console.log(`username: ${req.body.username}`);
  console.log(`password: ${req.body.password}`);
  console.log(`confirm password: ${req.body.confirm_password}`);
  
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  const cPassword = req.body.confirm_password.trim();

  try {
    //check if the user already exists
    const user = await User.findOne({username: username});
    //if no user is found, create a new user
    if(!user){
      //check if password is the same as confirm password 
      if(password != cPassword) {
        console.log("passwords do not match!");
        return res.redirect('/signup');
      }else{
        //save new user into DB
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
          profileimg: {
            data: fs.readFileSync(path.resolve(__dirname, '../public/images/defaultpfp.JPG')),
            contentType: 'image/jpg'
          }
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);

        //save user into DB
        newUser.password = hash;
        await newUser.save(newUser);
        req.logIn(newUser, (err) => {
          if(err) { return next(err); }
          console.log("successful registration...loging in");
          return res.redirect('/main');
        });
      }
    }else {
       //there already is a user with that username 
       console.log("that username is already taken!");
       //send error to view
       return res.redirect('/signup');
    }
  }catch(err){
    return next(err);
  }
});

/* POST user login */
router.post('/user-login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: "failed to login"
  }), (req, res) => {
    res.redirect('/main');
  });

/* POST logout */
router.post('/logout', async(req, res) => {
  req.logout((err) => {
    if(err) {
      console.log("failed to logout");
      return next(err);
    }
    console.log("logging out");
    res.redirect('/');
  });
});

/* POST delete review */
router.post('/book/:id', async(req, res, next) => {
  try {
    console.log(`book to be deleted: ${req.params.id}`);
    //const book = await Book.findById(req.params.id);
    const result = await Book.deleteOne({_id: req.params.id});

    if(result.deletedCount === 1){
      console.log("Delete successful");
      res.redirect('/edit-books');

    }else{
      console.log("Delete unsuccessful");
      res.render('error', { title: 'Error' });
    }

  }catch(err){
    return next(err);
  }
});

/* POST upload image */
router.post('/add-review', upload.single('book_pic'), async(req, res, next) => {
  try {
    const book = new Book({
      title: req.body.book_title,
      author: req.body.author,
      rating: req.body.rating,
      comment: req.body.comment, 
      bookimg: {
        data: fs.readFileSync(__dirname + '/uploads/' + req.file.filename),
        contentType: 'image/png'
      },
      creator: req.user.username,
      creatorimg: {
        data: req.user.profileimg.data,
        contentType: req.user.profileimg.contentType
      }
    });

    await book.save()
    res.redirect('/main');
  }catch(err){
    return next(err);
  }
});

module.exports = router;
