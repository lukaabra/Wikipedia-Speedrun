var express = require('express')
var router = express.Router();
var Article = require('../models/articles');

const ARTICLE_COUNT = 47163

function generateRandomArticle() {
    // Returns an object inside of an array, wrapped in a Promise --> Promise( [{...}] )

    // Returns a Promise
    let randomArticle = Article.aggregate().match({
        "links.1": { // Check if the record has at least 1 link
            "$exists": true
        }
    }).sample(1).exec();

    return randomArticle
}

// GET STARTING SCREEN
router.get("/start", async (req, res) => {
    const RANDOM_STARTING_ARTICLE = (await generateRandomArticle())[0];

    res.render("play/start", {
        startingArticle: RANDOM_STARTING_ARTICLE
    });
});

// GET ARTICLE
router.get("/play/:id", async (req, res) => {
    Article.findById(req.params.id, (err, foundArticle) => {
        if (err) {
            console.log("GET ARTICLE ERROR: " + err)
        } else {
            res.render("play/play", {
                article: foundArticle
            });
        }
    });
});

module.exports = router;