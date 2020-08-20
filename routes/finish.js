var express = require('express')
var router = express.Router();


// GET INDEX
router.get("/finish", (req, res) => {
    res.render("finish", {
        shortestPath: req.session.shortestPath,
        bestPossibleScore: req.session.bestPossibleScore,
        startingArticle: req.session.startingArticle,
        userScore: req.session.userScore,
        userPath: req.session.userPath
    });
});

module.exports = router;