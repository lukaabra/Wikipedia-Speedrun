const express = require('express');
const router = express.Router();
const Score = require('../models/scores');

router.get("/api/scores", async (req, res) => {
    let scores;
    if (req.query.topThree) {
        scores = await Score.aggregate().sort({
            'score': 'asc'
        }).limit(3).exec();
    } else {
        scores = await Score.find({}).sort('score').exec((err) => {
            if (err)
                console.log('Retrieving all scores error: ', err);
        });
    };

    res.json(scores);
});

module.exports = router;