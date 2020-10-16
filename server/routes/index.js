var express = require('express')
var router = express.Router();
var Score = require('../models/scores');


// GET INDEX
router.get("/", async (req, res) => {
    // Destroy session cookie that may be left over
    req.session.destroy();

    // Retrieve top 3 scores
    let topThreeScores = await Score.aggregate().sort({
        'score': 'asc'
    }).limit(3).exec();

    res.render("landing", {
        scores: topThreeScores
    });
});

module.exports = router;