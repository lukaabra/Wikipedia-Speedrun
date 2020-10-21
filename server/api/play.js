var express = require('express');
var router = express.Router();
var Article = require('../models/articles');

const middlewareObject = require('../middleware');

// GET STARTING SCREEN
router.get("/start", (req, res) => {
    res.render("play/start");
});

// GET METHOD FOR GENERATING RANDOM PAGE
router.get("/generate", middlewareObject.initialiseHints, middlewareObject.initialiseSessionData, async (req, res) => {
    const RANDOM_STARTING_ARTICLE = (await generateRandomArticle(req.query.difficulty))[0];

    // Set the shortest path of the random starting article to the session, so it can be accessed at the finishing screen
    // Also set the best possible score of the session to be the shortest distance of the random starting article form 'Rijeka'
    req.session.startingArticle = RANDOM_STARTING_ARTICLE.title;
    req.session.shortestPath = RANDOM_STARTING_ARTICLE.path;
    req.session.minPossibleSteps = RANDOM_STARTING_ARTICLE.distance;

    req.session.previousArticleChildren = RANDOM_STARTING_ARTICLE.edges;
    req.session.currentArticle = RANDOM_STARTING_ARTICLE.title;

    // Immediately redirects to GET ARTICLE route
    res.redirect("play/" + RANDOM_STARTING_ARTICLE._id)
});


// GET ARTICLE
router.get("/play/:id", middlewareObject.checkIfGameIsStarted, middlewareObject.trackHints, middlewareObject.checkWinningCondition, async (req, res) => {

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

    // If a hint is requested from the user then the next node in path is assigned
    let nextNodeInPath;
    if (req.query.hints && req.session.hints >= 0) nextNodeInPath = currentArticle.path[currentArticle.path.length - 2];
    else nextNodeInPath = '';

    // Increase the users score and log the path that the user takes
    req.session.userSteps++;
    req.session.userPath.push(currentArticle.title);

    // Prevent the user from advancing by tampering with the URL. Only possible to advance by clicking a link
    if (req.session.previousArticleChildren.includes(currentArticle.title) || req.session.userSteps == 1) {
        req.session.previousArticleChildren = currentArticle.edges;

        res.render('play/show', {
            article: currentArticle,
            currentArticleEdges: currentArticleEdges,
            hints: req.session.hints,
            userVisibleHint: nextNodeInPath
        });
    } else {
        res.redirect("/");
    }
});



module.exports = router;