const books = [
    {
        ISBN: "1234wq",
        Title: "Death Star",
        publications: [1], //ID of the publication
        date: "02-11-2022",
        pages: 250,
        authors: [1, 2],//ID of the authors
        category: ["tech", "education", "space"]
    },

    {
        ISBN: "1234ps",
        Title: "Death Star: THe Lost Space",
        publications: [1], //ID of the publication
        date: "02-12-2022",
        pages: 259,
        authors: [1, 2],//ID of the authors
        category: ["tech", "education", "space"]
    },

    {
        ISBN: "5643kf",
        Title: "Ten Years ago",
        publications: [3], //ID of the publication
        date: "02-03-2019",
        pages: 550,
        authors: [2],//ID of the authors
        category: ["tech", "education"]
    }, 

    {
        ISBN: "34rtrf",
        Title: "Turmoil of Hestia",
        publications: [2], //ID of the publication
        date: "02-10-2021",
        pages: 450,
        authors: [2],//ID of the authors
        category: ["novel", "fantasy", "tragedy"]
    }
];

const authors = [
    {
        id: 1,
        name: "Luke",
        books: ['1234eq', "1234ps"]
    },

    {
        id: 2,
        name: "Lukas D Draghnovos",
        books: ['1234eq', "5643kf", "34rtrf"]
    },
]

const publications = [
    {
        id: 1,
        name: "RV publications",
        books: ['1234eq', "1234ps"]
    },

    {
        id: 2,
        name: "Golden Era",
        books: ["5643kf" ]
    },

    {
        id: 3,
        name: "Maggpies",
        books: ['34rtrf']
    }
];

//Exporting all the files
module.exports = {books, authors, publications};