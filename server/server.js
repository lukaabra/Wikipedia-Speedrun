var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    Article = require('./models/articles');

// DATABASE SEEDING
var seed = require('../seed/seed');

// REQUIRING ROUTES
var indexRoutes = require('./routes/index'),
    playRoutes = require('./routes/play'),
    finishRoutes = require('./routes/finish'),
    topscoresRoutes = require('./routes/topscores');


(async () => {
    //====================================================
    // MONGOOSE SETUP
    // Connection is awaited to prevent database actions rushing before the connection is established.
    //====================================================
    await mongoose.connect('mongodb://localhost:27017/wiki_articles', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    //====================================================
    // CREATE GRAPH AND SEED DATABASE
    // ! WARNING !
    // COMMENT OUT ONLY IF YOU WANT TO WRITE JSON FILES AND DB FROM SCRATCH
    //====================================================
    // const STARTING_ARTICLE = 'Rijeka'
    // await seed.constructGraphToJSON(STARTING_ARTICLE);
    // await seed.saveGraphToDb();
})();

// Express uses the body parser to parse the requests body from URL encodings to JS
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

// Session setup
app.use(session({
    secret: 'Speedrunning is my passion',
    maxAge: 3600000,
    resave: false,
    saveUninitialized: false
}));

app.use(indexRoutes);
app.use(playRoutes);
app.use(finishRoutes);
app.use(topscoresRoutes);

app.listen(3000, () => {
    console.log("Server starting at port 3000 ...");
});