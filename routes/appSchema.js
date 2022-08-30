const mongoose = require('mongoose');

/*
mongoose.connect("mongodb+srv://katrinajamir:koolkatbooks@katjamjam.b7qkwy7.mongodb.net/?retryWrites=true&w=majority");

const connection = mongoose.connection;

connection
.on('open', () => console.log("database connected"))
.on('close', () => console.log("database disconnected"))
.on('error', (error) => console.log(error));

*/
const {model, Schema} = mongoose;

const userSchema = new Schema({
    username: {type: String, unique:true, required:true},
    password: {type: String, required: true},
    profileimg: {data: Buffer, contentType: String},
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }]  
}, {timstamps: true});

const bookSchema = new Schema({
    title: String,
    author: String,
    rating: Number,
    comment: String,
    bookimg: {data: Buffer, contentType: String},
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timeStamps: true});

exports.User = model('User', userSchema);
exports.Book = model('Books', bookSchema);