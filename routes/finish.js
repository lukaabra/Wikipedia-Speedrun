var express = require('express');
var router = express.Router();
var Score = require('../models/scores');


// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


// GET FINISH
router.get("/finish", (req, res) => {

    // If the user surrendered, reset the score to 0
    if (req.query.surrender) {
        req.session.userSteps = 0;
        req.session.userPath.push('SURRENDERED!');
    } else {
        req.session.userPath.push('Rijeka');
    };

    let gameData = {
        userName: req.session.name,
        userScore: req.session.score,
        userPath: req.session.userPath,
        shortestPath: req.session.shortestPath,
        userSteps: req.session.userSteps,
        minPossibleSteps: req.session.minPossibleSteps,
        startingArticle: req.session.startingArticle,
        surrendered: req.query.surrender,
        totalRunTime: req.session.totalRunTime
    }

    res.render("finish", {
        gameData: gameData
    });
});

router.post("/finish", (req, res) => {
    req.session.name = req.body.name;

    // Time the user finished the run
    req.session.finishingTime = Date.now();

    // Set the elapsed time of the run
    let timeElapsed = req.session.finishingTime - req.session.startingTime;
    if (timeElapsed >= 3600000) {
        req.session.totalRunTime = 'Over 1 hour'
    } else {
        req.session.totalRunTime = millisToMinutesAndSeconds(timeElapsed);
    }

    // Calculate the total score
    const ARBITRARY_CONSTANT = 3;
    let coefficient = Math.floor((timeElapsed / 1000) / req.session.userSteps)
    console.log(coefficient);
    let calculatedScore = Math.floor((timeElapsed / 1000) * req.session.userSteps + ARBITRARY_CONSTANT * coefficient);
    req.session.score = calculatedScore;
    console.log(calculatedScore)

    // Construct object to store to DB
    let scoreToSubmit = {
        name: req.session.name,
        time: req.session.totalRunTime,
        steps: req.session.userSteps,
        minPossibleSteps: req.session.minPossibleSteps,
        startingArticle: req.session.startingArticle,
        score: calculatedScore
    };

    Score.create(scoreToSubmit, (err, submittedScore) => {
        if (err) console.log("SUBMITTING SCORE ERROR: " + err);
    });

    res.redirect("/finish");
})

module.exports = router;