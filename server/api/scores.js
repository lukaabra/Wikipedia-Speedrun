const express = require('express');
const router = express.Router();
const Score = require('../models/scores');

router.get("/api/score-table", async (req, res) => {
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

// Consider calculating the time on the server.
// In such a case, a fail might occur where the rendered timer in react and the server timer don't match.
router.get('/api/calculate-score/:time', async (req, res) => {
    const runTimeMs = req.params.time;
    // const steps = req.session.steps;
    const steps = 15;

    const coefficient = Math.floor((runTimeMs / 1000) / steps);
    const runScore = Math.floor((runTimeMs / 1000) * steps) + (2 * coefficient);

    const score = {
        runScore,
        steps
        // userPath: req.session.path
    };
    res.json(score);
});

module.exports = router;