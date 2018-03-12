// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser'),
  db = require('./models');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////
//  DATA
///////////////////


var newBookUUID = 18;







////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find(function(err, books){
    if (err) {
      console.log("index error: " + err);
      res.sendStatus(500);
    }
    res.json(books);
  });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  db.Book.findOne({_id: req.params.id }, function(err, data) {
    res.json(data);
  });
});

// create new book
app.post('/api/books', function (req, res) {
  app.post('/api/books', function (req, res) {
    // create new book with form data (`req.body`)
    var newBook = new db.Book({
      title: req.body.title,
      image: req.body.image,
      releaseDate: req.body.releaseDate,
    });
    // find the author from req.body
    db.Author.findOne({name: req.body.author}, function(err, author){
      if (err) {
        return console.log(err);
      }
      // if that author doesn't exist yet, create a new one
      if (author === null) {
        db.Author.create({name:req.body.author, alive:true}, function(err, newAuthor) {
          createBookWithAuthorAndRespondTo(newBook, newAuthor, res);
        });
      } else {
        createBookWithAuthorAndRespondTo(newBook, author, res);
      }
    });
  });

  function createBookWithAuthorAndRespondTo(book, author, res) {
    // add this author to the book
    book.author = author;
    // save newBook to database
    book.save(function(err, book){
      if (err) {
        return console.log("save error: " + err);
      }
      console.log("saved ", book.title);
      // send back the book!
      res.json(book);
    });
  }
});

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  console.log('books update', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  var updateBookIndex = books.findIndex(function(element, index) {
    return (element._id === parseInt(req.params.id)); //params are strings
  });
  console.log('updating book with index', deleteBookIndex);
  var bookToUpdate = books[deleteBookIndex];
  books.splice(updateBookIndex, 1, req.params);
  res.json(req.params);
});

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
 console.log('books delete', req.params);
 var bookId = req.params.id;
 // find the index of the book we want to remove
 db.Book.findOneAndRemove({ _id: bookId })
   .populate('author')
   .exec(function (err, deletedBook) {
     res.json(deletedBook);
 });
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
