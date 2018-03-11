var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
     title: String,
     author: String,
     image: String,
     releaseDate: Number
 });

var Book = mongoose.model('Book', BookSchema);

module.exports = Book;
