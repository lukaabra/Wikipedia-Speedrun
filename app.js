var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles.js');

// const seed = require('./seed.js')    // Database seeding


//====================================================
// MONGOOSE SETUP
//====================================================

mongoose.connect('mongodb://localhost:27017/test', {
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
    Article.find({
        title: "Ogulin"
    }, (err, randomArticle) => {

        console.log(randomArticle.length)

        if (err) console.log(err);

        else res.render("start", {
            randomArticle: randomArticle
        });
    })
});

app.listen(3000, () => {
    console.log("Server starting at port 3000 ...");
});