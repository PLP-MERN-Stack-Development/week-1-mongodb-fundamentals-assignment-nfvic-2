// queries.js - MongoDB queries for PLP Bookstore assignment

// ----------------------
// Basic CRUD Operations
// ----------------------

// Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

// Find books by a specific author
db.books.find({ author: "George Orwell" });

// Update the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 13.99 } });

// Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });


// ----------------------
// Advanced Queries
// ----------------------

// Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Projection: Return only title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// Sort books by price ascending
db.books.find().sort({ price: 1 });

// Sort books by price descending
db.books.find().sort({ price: -1 });

// Pagination (first page)
db.books.find().limit(5);

// Pagination: 5 books per page (example: page 2)
db.books.find().skip(5).limit(5);

// ----------------------
// Aggregation Pipelines
// ----------------------

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", average_price: { $avg: "$price" } } }
]);

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", book_count: { $sum: 1 } } },
  { $sort: { book_count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: ["$published_year", 0, 3] },
          "0s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


// ----------------------
// Indexing
// ----------------------

// Create index on title
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain to show performance (example query)
db.books.find({ title: "1984" }).explain("executionStats");
