var express = require('express')
var router = express.Router();


// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


// GET FINISH
router.get("/finish", (req, res) => {
    // Time the user finished the run
    req.session.finishingTime = Date.now();

    // Set the elapsed time of the run
    let timeElapsed = req.session.finishingTime - req.session.startingTime;
    if (timeElapsed >= 3600000) {
        req.session.totalRunTime = 'Over 1 hour'
    } else {
        req.session.totalRunTime = millisToMinutesAndSeconds(timeElapsed);
    }

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
        totalRunTime: req.session.totalRunTime
    });
});

module.exports = router;