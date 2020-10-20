const express = require('express');
const router = express.Router();
const Score = require('../models/scores');

router.get("/api/scores", async (req, res) => {
    console.log(req.query);
    let scores;
    if (req.query.topThree) {
        scores = await Score.aggregate().sort({
            'score': 'asc'
        }).limit(3).exec();
    } else {
        scores = await Score.find({}).sort('score').exec((err, allScores) => {
            if (err) console.log("FIND SCORES ERROR: " + err);
            else {
                res.render("topscores", {
                    scores: allScores
                });
            }
        });
    };

    res.json(scores);
});

module.exports = router;