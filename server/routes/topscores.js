var express = require('express')
var router = express.Router();
var Score = require('../models/scores');


// GET TOP SCORES
router.get("/topscores", (req, res) => {
    // Score.deleteMany({}, () => {})
    Score.find({}).sort('score').exec((err, allScores) => {
        if (err) console.log("FIND SCORES ERROR: " + err);
        else {
            res.render("topscores", {
                scores: allScores
            });
        }
    });
});

module.exports = router;