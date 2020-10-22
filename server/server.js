const express = require('express'),
    app = express(),
    session = require('express-session'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    Article = require('./models/articles');

// DATABASE SEEDING
// const seed = require('../seed/seed');

// REQUIRING ROUTES
const scoresRouter = require('./api/scores');
const randomArticleRouter = require('./api/generateRandom');
const articleRouter = require('./api/article');


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

// Session setup
app.use(session({
    secret: 'Speedrunning is my passion',
    maxAge: 3600000,
    resave: false,
    saveUninitialized: false
}));

app.use(cors());
app.use(scoresRouter);
app.use(randomArticleRouter);
app.use(articleRouter);

app.listen(3001, () => {
    console.log("Server starting at port 3001 ...");
});