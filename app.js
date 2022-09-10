const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//passport authentication configuration
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const schema = require('./routes/appSchema');
const User = schema.User;
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb+srv://katrinajamir:koolkatbooks@katjamjam.b7qkwy7.mongodb.net/?retryWrites=true&w=majority");

const connection = mongoose.connection;

connection
.on('open', () => console.log("database connected"))
.on('close', () => console.log("database disconnected"))
.on('error', (error) => console.log(error));


app.use(session({
  secret: 'kit kats',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl: "mongodb+srv://katrinajamir:koolkatbooks@katjamjam.b7qkwy7.mongodb.net/?retryWrites=true&w=majority"}),
  cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  (username, password, cb) => {
    console.log("in local strategy");
    User.findOne({username: username}, (err, user) => {
      console.log(`to authenticate user: ${user.username}`);
      if(err) { 
        console.log(`there is an error: ${err}`);
        return cb(err); 
      }

      if(!user) {
        console.log("no registered user found for authenticate");
        return cb(null, false); 
      }else{
        console.log(`password entered: ${password}`);
        console.log(`password in DB: ${user.password}`);
        bcrypt.compare(password, user.password, (err, isAMatch) => {
          console.log("checking passwords");
          if(isAMatch){
            console.log(`password matches! Local Strategy success for user: ${user}`);
            return cb(null, user);
          }else{
            console.log("passowords do not match. LS failed");
            return cb(null, false);
          }
        });
      }
    });
  }
));

//sessions
passport.serializeUser((user, cb) => {
  console.log(`in serializer user id: ${user.id}`);
  cb(null,user._id);
});

passport.deserializeUser((id, cb) => {
  console.log(`in deserialize user id: ${id}`);
  User.findById(id, (err, user) => {
    cb(err, user);
  });
});

/*
app.use((req,res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  req.next();
});
*/
app.set('trust proxy', 1);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
