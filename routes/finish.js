var express = require('express')
var router = express.Router();


// GET INDEX
router.get("/finish", (req, res) => {
    // If the user surrendered, reset the score to 0
    if (req.query.surrender) {
        req.session.userScore = 0;
        req.session.userPath.push('SURRENDERED!');
    } else {
        req.session.userPath.push('Rijeka');
    };

    res.render("finish", {
        shortestPath: req.session.shortestPath,
        bestPossibleScore: req.session.bestPossibleScore,
        startingArticle: req.session.startingArticle,
        userScore: req.session.userScore,
        userPath: req.session.userPath,
        surrender: req.query.surrender
    });
});

module.exports = router;