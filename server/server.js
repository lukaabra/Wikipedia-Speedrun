const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cors = require('cors'),
    Article = require('./models/articles');

// DATABASE SEEDING
// const seed = require('../seed/seed');

// REQUIRING ROUTES
const apiRouter = require('./api/scores');


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


app.use(cors());
app.use(apiRouter);

app.listen(3001, () => {
    console.log("Server starting at port 3001 ...");
});