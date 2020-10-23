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
router.get('/api/calculate-score/:difficulty/:time', async (req, res) => {
    // const steps = req.session.steps;
    const steps = 15;
    const runScore = calculateScore(req.params.difficulty, req.params.time, steps);

    const score = {
        runScore,
        steps
        // userPath: req.session.path
    };
    res.json(score);
});

//==================================================
//              HELPER FUNCTIONS
//==================================================

calculateScore = (difficulty, runTimeMs, steps) => {
    let difficultyCoefficient;
    switch (difficulty) {
        case 'easy':
            difficultyCoefficient = 7;
            break;
        case 'medium':
            difficultyCoefficient = 3;
            break;
        case 'hard':
            difficultyCoefficient = 1;
            break;
    };

    const timePerStep = ((runTimeMs / 1000) / steps).toFixed(2);
    return (
        steps + (timePerStep * 2) * difficultyCoefficient
    ).toFixed(2);
};

module.exports = router;