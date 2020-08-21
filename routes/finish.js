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
        surrender: req.query.surrender,
        totalRunTime: req.session.totalRunTime,
        userName: req.session.name
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
    let coefficient = Math.floor((timeElapsed * 1000) / req.session.userScore)
    let calculatedScore = (timeElapsed * 1000) * req.session.userScore + 3 * coefficient;

    console.log(req.query);

    // Construct object to store to DB
    let scoreToSubmit = {
        name: req.session.name,
        time: req.session.totalRunTime,
        steps: req.session.userScore,
        minPossibleSteps: req.session.bestPossibleScore,
        startingArticle: req.session.startingArticle,
        score: calculatedScore
    };

    Score.create(scoreToSubmit, (err, submittedScore) => {
        if (err) console.log("SUBMITTING SCORE ERROR: " + err);
        else console.log(submittedScore);
    });

    res.redirect("/finish");
})

module.exports = router;