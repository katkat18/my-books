const mongoose = require('mongoose');

const {model, Schema} = mongoose;

const userSchema = new Schema({
    username: {type: String, unique:true, required:true},
    password: {type: String, required: true},
    profileimg: {data: Buffer, contentType: String},
}, {timstamps: true});

const bookSchema = new Schema({
    title: String,
    author: String,
    rating: Number,
    comment: String,
    bookimg: {data: Buffer, contentType: String},
    creator: String,
    creatorimg: {data: Buffer, contentType: String}
}, {timeStamps: true});

exports.User = model('User', userSchema);
exports.Book = model('Book', bookSchema);