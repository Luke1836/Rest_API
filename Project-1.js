require("dotenv").config();

const express = require("express");
var bodyParser = require("body-parser");
const database = require("./Database/database");
const mongoose = require("mongoose");
const ex = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'));

//For executing the post request
ex.use(bodyParser.json());


//Models
const bookModel = require("./Database/books.js");
const authorModel = require("./Database/authors.js");
const publicationModel = require("./Database/publications.js");


/*
    Route           /
    Description     Get all the books from the database
    Access          Public
    Parameters      None
    Methods         GET
*/

ex.get("/", async (request, response) =>
        {
            const getAlllBooks = await bookModel.find();
            return response.json(getAlllBooks);            
        }

);

/*
    Route           /is
    Description     Get details of a particular book from the database based on the ISBN number
    Access          Public
    Parameters      ISBN
    Methods         GET
*/
ex.get("/is/:isbn", async (request, response) =>
        {
            const getSpecififcBook = await bookModel.findOne({ISBN: request.params.isbn});
            if(!getSpecififcBook)
                    return response.json({error: `No book found for the ISBN number: ${request.params.isbn}.`});
            return response.json({particularBook: getSpecififcBook});
        });

/*
    Route           /c
    Description     Get details of a particular book from the database based on the category
    Access          Public
    Parameters      category
    Methods         GET
*/

ex.get("/c/:category", async (request, response) =>
        {
            const specificBook = await bookModel.findOne({category: request.params.category})
            if(!specificBook)
                return response.json({error: `There is no book under the category ${request.params.category}.`});
            return response.json({Details: specificBook});
        });

/*
    Route           /author
    Description     Get all the books from the database
    Access          Public
    Parameters      None
    Methods         GET
*/


ex.get("/author", async (request, response) =>
        {
            const getAllAuthors = await authorModel.find();
            return response.json({authors: getAllAuthors});
        });


/*
    Route           /author/book
    Description     Get details of a particular book from the database based on the author
    Access          Public
    Parameters      author
    Methods         GET
*/


ex.get("/author/book/:isbn", async (request, response) =>
            {
                const specificAuthor = database.authors.filter((isbn_no) =>
                        isbn_no.books.includes((request.params.isbn)));
                if(specificAuthor.length === 0)
                    return response.json({error: `There are no book written by the authors in the given database.`});
                return response.json({Details: specificAuthor});
            });

/*
    Route           /publications
    Description     Get all the books from the database
    Access          Public
    Parameters      None
    Methods         GET
*/


ex.get("/publications", async (request, response) =>
    {
        const getAllPublication = await publicationModel.find();
        return response.json(getAllPublication);
    });


/*
    Route           /book/new
    Description     Add new book
    Access          Public
    Parameters      None
    Methods         POST
*/


ex.post("/book/new", async (request, response) => {
    const { newBook } = request.body;
    const addNewBook = bookModel.create(newBook);
    return response.json({ message: "Book was added successfully", book: addNewBook});
});


/*
    Route           /author/new
    Description     Add a new author and his contributions
    Access          Public
    Parameters      None
    Methods         POST
*/

ex.post("/author/new", async (request, response) => {
    const { newAuthor } = request.body;
    const addNewAuthor = authorModel.create(newAuthor);
    return response.json({ message: "Author added successfully", author: addNewAuthor });
});


/*
    Route           /publications/new
    Description     Add a publication to the database
    Access          Public
    Parameters      None
    Methods         POST
*/

ex.post("/publications/new", async (request, response) =>
{
    const { newPublication } = request.body;
    const addNewPublication = publicationModel.create(newPublication);
    return response.json({message: "Publication is added successfully", publicaation: addNewPublication});

});

/*
    Route           /publications/book/update
    Description     Update an exisitng one or add a new one.
    Access          Public
    Parameters      None
    Methods         PUT
*/

ex.put("/publications/book/update/:isbn", (request, response) => 
{
    database.publications.forEach((pub) =>
        {
            if(pub.id === request.body.pubId)
                return pub.books.push(request.params.isbn);
        });

    database.books.forEach((book) =>
        {
            if(book.id === request.params.isbn)
                book.publications = request.body.pubId;
            return;
        });

    return response.json({publications: database.publications,
                          Books: database.books,
                          message: "Successfully added."}
                         );
});


/*
    Route           /author/book/update
    Description     Update an exisitng one or add a new one.
    Access          Public
    Parameters      None
    Methods         PUT
*/

ex.put("/author/book/update/:isbn", (request, response) =>
{
    database.authors.forEach((author) =>
        {
            if(author.id === request.body.authorId)
                return author.books.push(request.params.isbn);
        });
    database.books.forEach((book) =>
        {
            if(book.ISBN === request.params.isbn)
                book.authors.push(request.body.authorId);
            return;
        });
        return response.json({Authors: database.authors,
                              Books: database.books,
                              message: "Successfully added."}
                            );
});


/*
    Route           /book/update
    Description     Update a book based in isbn.
    Access          Public
    Parameters      None
    Methods         PUT
*/

ex.put("/book/update/:isbn", async (request, response) =>
        {
            const updatedBooks = await bookModel.findOneAndUpdate(
                {
                    ISBN: request.params.isbn
                },
                {
                    Title: request.body.titleChange
                },
                {
                    new: true
                }
            );

            return response.json({UpdatedBooks: updatedBooks});
        })

/*
    Route           /book/author/update
    Description     Update a book based in isbn.
    Access          Public
    Parameters      None
    Methods         PUT
*/

ex.put("/book/author/update/:isbn", async (request, response) =>
            {
                const updatedBooks = await bookModel.findOneAndUpdate(
                    {
                        ISBN: request.params.isbn
                    },
                    {
                        $addToSet: {
                            authors: request.body.authorID
                        }
                    },
                    {
                        new: true
                    }
                )
                
                const updateAuthors = await authorModel.findOneAndUpdate(
                    {
                        id: request.body.authorID
                    },
                    {
                        $addToSet: {
                            books: request.params.isbn
                        }
                    },
                    {
                        new: true
                    }

                )
                return response.json(
                    {
                        Books: updatedBooks
                    },
                    {
                        authors : updateAuthors
                    },
                    {
                        message: "Books and Authors were updated successfully!"
                    }

                )
            })

/*
    Route           /book/author/delete
    Description     Delete a particular book
    Access          Public
    Parameters      None
    Methods         DELETE
*/

ex.delete("/book/delete/:isbn", async (request, response) =>
        {
            const updatedBooks = await bookModel.findOneAndDelete(
                {
                    ISBN: request.params.isbn       
                }
            );

            return response.json({Books: updatedBooks});
        })

        
/*
    Route           /book/author/delete
    Description     Delete a particular book
    Access          Public
    Parameters      None
    Methods         DELETE
*/

ex.delete("/book/delete/author/:isbn/:authorId", (request, response) => {
    const isbn = request.params.isbn;
    const authorId = request.params.authorId;

    // Find the book with the given ISBN
    const bookIndex = database.books.findIndex((book) => book.ISBN === isbn);

    if (bookIndex === -1) {
        return response.json({ error: `No book found for ISBN: ${isbn}` });
    }

    // Find the author with the given authorId
    const authorIndex = database.authors.findIndex((author) => author.id === (parseInt(authorId)));

    if (authorIndex === -1) {
        return response.json({ error: `No author found with id: ${authorId}` });
    }

    // Update the book's authors and the author's books
    database.books[bookIndex].authors = database.books[bookIndex].authors.filter((aId) => aId !== authorId);
    database.authors[authorIndex].books = database.authors[authorIndex].books.filter((bISBN) => bISBN !== isbn);

    return response.json({
        message: "Book and author associations removed successfully.",
        book: database.books,
        author: database.authors,
    });
});

ex.listen(3000, () => {
    console.log("The server is open at port 3000");
});