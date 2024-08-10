const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
            ISBN: String,
            Title: String,
            publications: [Number], //ID of the publication
            date: String,
            pages: Number,
            authors: [Number],//ID of the authors
            category: [String]
    }
)

const bookModel = mongoose.model("books", bookSchema);
module.exports = bookModel;