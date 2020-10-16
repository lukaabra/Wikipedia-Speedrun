var express = require('express');
var router = express.Router();
var Score = require('../models/scores');

const middlewareObject = require('../middleware');

const MAX_ALLOWED_RANK = 3,
    RANK_TABLE_SIZE = 100;


//==================================================
//              GET FINISH ROUTE
//==================================================
router.get("/finish", middlewareObject.checkIfGameIsFinished, middlewareObject.checkIfUserSurrendered, (req, res) => {

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

    // Destroy session cookie
    req.session.destroy();

    res.render("finish", {
        gameData: gameData
    });
});


//==================================================
//              POST FINISH ROUTE
//==================================================
router.post("/finish", async (req, res) => {
    // Save the users submitted name to the session
    req.session.name = req.body.name;
    // Signal that the game is finished
    req.session.finished = true;

    req.session.finishingTime = Date.now();
    let runTimeInMs = req.session.finishingTime - req.session.startingTime;
    req.session.totalRunTime = setElapsedRunTime(runTimeInMs);

    req.session.score = calculateScore(runTimeInMs, req.session.userSteps);

    // Retrieve the whole ranking table
    let completeRankingTable = await Score.aggregate().sort({
        'score': 'asc'
    }).limit(RANK_TABLE_SIZE).exec();

    var rank = calculateRanking(req.session.score, completeRankingTable);

    // Only accept games on hard difficulty to be ranked
    if (rank <= MAX_ALLOWED_RANK && req.session.difficulty == "hard") {
        await updateRankingTable(rank, completeRankingTable);
        await deleteSurplusScores();

        // Construct object to store to DB
        let scoreToSubmit = {
            name: req.session.name,
            time: req.session.totalRunTime,
            steps: req.session.userSteps,
            minPossibleSteps: req.session.minPossibleSteps,
            startingArticle: req.session.startingArticle,
            score: req.session.score,
            rank: rank
        };

        await Score.create(scoreToSubmit, (err, submittedScore) => {
            if (err) console.log("SUBMITTING SCORE ERROR: " + err);
            else {
                // Save the id of the submitted score so the ranking of the player can be shown on the finishing screen
                req.session.rank = submittedScore.rank;
                res.redirect("/finish");
            }
        });
    } else {
        res.redirect("/finish");
    }
});

//==================================================
//              HELPER FUNCTIONS
//==================================================
function calculateRanking(playerScore, rankingTable) {
    // Check if array is empty (any ranks at all): 
    // https://stackoverflow.com/questions/24403732/how-to-check-if-array-is-empty-or-does-not-exist
    if (rankingTable && rankingTable.length) {
        // Perform a rank query using binary search for finding the left-most element
        let low = 0;
        let high = rankingTable.length;

        while (low < high) {
            let mid = Math.floor((low + high) / 2);

            if (rankingTable[mid].score < playerScore) low = mid + 1;
            else high = mid;
        }
        // low is the index where the playerScore should be in rankingTable. Adding 1 will give the real rank in the table
        return low + 1
    } else {
        return 1
    }
};

function calculateScore(timeElapsed, userSteps) {
    let coefficient = Math.floor((timeElapsed / 1000) / userSteps);
    let calculatedScore = Math.floor((timeElapsed / 1000) * userSteps + coefficient);

    return calculatedScore;
}

async function deleteSurplusScores() {
    let scoresToDelete = await Score.aggregate().match({
        "rank": {
            "$gte": MAX_ALLOWED_RANK
        }
    }).exec();

    for (let score of scoresToDelete) {
        Score.findByIdAndDelete(score._id, (err, deletedScore) => {
            if (err) console.log("DELETING EXTRA SCORE ERROR: " + err);
        });
    };
};

// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function setElapsedRunTime(runTimeInMs) {
    let totalRunTime;
    if (runTimeInMs >= 3600000) {
        totalRunTime = 'Over 1 hour';
    } else {
        totalRunTime = millisToMinutesAndSeconds(runTimeInMs);
    }

    return totalRunTime;
};

async function updateRankingTable(rankFromWhichToUpdate, rankingTable) {
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
};

module.exports = router;