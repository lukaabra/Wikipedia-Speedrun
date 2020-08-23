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
        req.session.score = 0;
        req.session.userSteps = 0;
        req.session.userPath.push('SURRENDERED!');
        req.session.totalRunTime = 'No time'
    } else {
        req.session.userPath.push('Rijeka');
    };

    let gameData = {
        userName: req.session.name,
        userScore: req.session.score,
        userRank: req.session.rank,
        userPath: req.session.userPath,
        shortestPath: req.session.shortestPath,
        userSteps: req.session.userSteps,
        minPossibleSteps: req.session.minPossibleSteps,
        difficulty: req.session.difficulty,
        startingArticle: req.session.startingArticle,
        surrendered: req.query.surrender,
        totalRunTime: req.session.totalRunTime
    }

    res.render("finish", {
        gameData: gameData
    });
});


// POST FINISH
router.post("/finish", async (req, res) => {
    req.session.name = req.body.name;

    // Time the user finished the run
    req.session.finishingTime = Date.now();

    // Set the elapsed time of the run
    let timeElapsed = req.session.finishingTime - req.session.startingTime; // in ms
    if (timeElapsed >= 3600000) {
        req.session.totalRunTime = 'Over 1 hour'
    } else {
        req.session.totalRunTime = millisToMinutesAndSeconds(timeElapsed);
    }

    let difficultyScoreCoefficient;
    switch (req.session.difficulty) {
        case 'easy':
            difficultyScoreCoefficient = 3;
            break;
        case 'medium':
            difficultyScoreCoefficient = 2.5;
            break;
        case 'hard':
            difficultyScoreCoefficient = -1;
            break;
    }

    // Calculate total score of the run
    let coefficient = Math.floor((timeElapsed / 1000) / req.session.userSteps)
    let calculatedScore = Math.floor((timeElapsed / 1000) * req.session.userSteps + difficultyScoreCoefficient * coefficient);
    req.session.score = calculatedScore;

    let completeRankingTable = await Score.aggregate().sort({
        'score': 'asc'
    }).limit(100).exec();

    var rank = calculateRanking(calculatedScore, completeRankingTable);
    // IF YOU AWAIT updateRankingTable, AND AWAIT THE DB LOOKUP INSIDE THE FUNCTION, FOR SOME REASON IT WILL
    // INCREASE THE RANK BY 2 INSTEAD OF 1
    updateRankingTable(rank, completeRankingTable);

    // Construct object to store to DB
    let scoreToSubmit = {
        name: req.session.name,
        time: req.session.totalRunTime,
        steps: req.session.userSteps,
        minPossibleSteps: req.session.minPossibleSteps,
        startingArticle: req.session.startingArticle,
        score: calculatedScore,
        difficulty: req.session.difficulty,
        rank: rank
    };

    Score.create(scoreToSubmit, (err, submittedScore) => {
        if (err) console.log("SUBMITTING SCORE ERROR: " + err);
        else {
            // Save the id of the submitted score so the ranking of the player can be shown on the finishing screen
            req.session.rank = submittedScore.rank;
            res.redirect("/finish");
        }
    });
});

function calculateRanking(playerScore, rankingTable) {
    // Check if array is empty (any ranks at all): 
    // https://stackoverflow.com/questions/24403732/how-to-check-if-array-is-empty-or-does-not-exist
    if (rankingTable && rankingTable.length) {
        // Perform a rank query using binary search for finding the left-most element
        let low = 0;
        let high = rankingTable.length;

        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            if (rankingTable[mid].score < playerScore) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        // low is the index where the playerScore should be in rankingTable. Adding 1 will give the real rank in the table
        return low + 1
    } else {
        return 1
    }
};

function updateRankingTable(rankFromWhichToUpdate, rankingTable) {
    // Rank is larger than the position in the ranking table by 1
    let rankingTableToUpdate = rankingTable.slice(rankFromWhichToUpdate - 1);
    for (let score of rankingTableToUpdate) {
        Score.findByIdAndUpdate(score._id, {
            '$inc': {
                'rank': 1
            }
        }, (err, foundScore) => {
            if (err) console.log("UPDATE RANK ERROR: " + err);
        });
    }
}

module.exports = router;