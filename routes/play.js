var express = require('express');
var router = express.Router();
var Article = require('../models/articles');
const middlewareObject = require('../middleware');


function generateRandomArticle(difficulty) {
    // Returns an object inside of an array, wrapped in a Promise --> Promise( [{...}] )

    let distGT, distLT;
    switch (difficulty) {
        case 'easy':
            distGT = 1;
            distLT = 8
            break;
        case 'medium':
            distGT = 2;
            distLT = 5;
            break;
        case 'hard':
            distGT = 5;
            distLT = 8;
            break;
    }

    // Returns a Promise
    let randomArticle = Article.aggregate().match({
        "distance": { // Check if distance is in accordance with the selected difficulty
            "$gt": distGT,
            "$lt": distLT
        }
    }).sample(1).exec();

    return randomArticle
}

// GET STARTING SCREEN
router.get("/start", (req, res) => {
    res.render("play/start");
});

// GET METHOD FOR GENERATING RANDOM PAGE
router.get("/generate", async (req, res) => {
    const RANDOM_STARTING_ARTICLE = (await generateRandomArticle(req.query.difficulty))[0];
    console.log("RANDOM DISTANCE: " + RANDOM_STARTING_ARTICLE.distance);
    console.log("DIFFICULTY: " + req.query.difficulty);

    res.redirect("play/" + RANDOM_STARTING_ARTICLE._id)
});


// GET ARTICLE
router.get("/play/:id", middlewareObject.checkDifficulty, async (req, res) => {

    let currentArticle = await Article.findById(req.params.id, (err, foundArticle) => {
        if (err) console.log("GET ARTICLE ERROR: " + err)
    });
    let currentArticleEdges = {};

    // Iterate over all the edges
    for (let edge of currentArticle.edges) {
        let edgeRecord = await Article.findOne({
            'title': edge
        }, (err, foundEdgeRecord) => {
            if (err) console.log("GET ARTICLE EDGE ERROR: " + err)
        });

        currentArticleEdges[edgeRecord.title] = edgeRecord;
    }

    res.render('play/show', {
        article: currentArticle,
        currentArticleEdges
    });
});

module.exports = router;