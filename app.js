var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles.js');

// const seed = require('./seed.js')    // Database seeding

const ARTICLE_COUNT = 47163;

//====================================================
// MONGOOSE SETUP
//====================================================

mongoose.connect('mongodb://localhost:27017/wiki_articles', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database seeding
// (async () => {
//     seed.seedDb('Rijeka');
// })();

app.set("view engine", "ejs");

// GET INDEX
app.get("/", (req, res) => {
    res.render("landing");
});

// GET INSTRUCTIONS
app.get("/instructions", (req, res) => {
    res.render("instructions");
});

// GET RANDOM ARTICLE
app.get("/start", (req, res) => {

    let random = Math.floor(Math.random() * ARTICLE_COUNT);

    // TODO: If the user refreshes the page lots of times, the skip(random) will skip outside of the database
    // and return null as randomArticle
    Article.findOne({
        "links.1": {
            "$exists": true
        }
    }).skip(random).exec((err, randomArticle) => {
        try {
            console.log(randomArticle.links.length)
        } catch (e) {
            if (e instanceof TypeError) console.log("TYPE ERROR: " + randomArticle)
            else console.log(e)
        }
        if (err) console.log(err);
        else res.render("start", {
            randomArticle: randomArticle
        });
    });
});

app.listen(3000, () => {
    console.log("Server starting at port 3000 ...");
});