const express = require('express');
const router = express.Router();
const Score = require('../models/scores');

const RANK_TABLE_SIZE = 100;

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
    const steps = req.session.steps;
    const userPath = req.session.path;
    const runScore = calculateScore(req.params.difficulty, req.params.time, steps);
    const toSubmitScore = req.query.submit;

    const rankingTable = await getRankingTable();
    const rank = calculateRanking(runScore, rankingTable);

    if (toSubmitScore === 'true') {
        await updateRankingTable(rank, rankingTable);
        await deleteSurplusScores(RANK_TABLE_SIZE);
    }

    const score = {
        rank,
        runScore,
        steps,
        userPath
    };
    res.json(score);
});

// Finish submit score
router.post('/api/score', async (req, res) => {
    await submitScore(score);
});

//==================================================
//              HELPER FUNCTIONS
//==================================================

calculateRanking = (playerScore, rankingTable) => {
    // Check if array is empty (any ranks at all): 
    // https://stackoverflow.com/questions/24403732/how-to-check-if-array-is-empty-or-does-not-exist
    if (rankingTable && rankingTable.length) {
        // Perform a rank query using binary search for finding the left-most element
        let low = 0;
        let high = rankingTable.length;

        while (low < high) {
            let mid = Math.floor((low + high) / 2);

            if (rankingTable[mid].score < playerScore)
                low = mid + 1;
            else
                high = mid;
        }
        // low is the index where the playerScore should be in rankingTable. Adding 1 will give the real rank in the table
        return low + 1
    } else {
        return 1
    }
};

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

deleteSurplusScores = async (MAX_ALLOWED_RANK) => {
    const scoresToDelete = await Score.aggregate().match({
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

getRankingTable = () => {
    return Score.aggregate().sort({
        'score': 'asc'
    }).limit(RANK_TABLE_SIZE).exec();
};

submitScore = (score) => {
    return Score.create(score, (err, submittedScore) => {
        if (err)
            console.log("SUBMITTING SCORE ERROR: " + err);
    });
}

updateRankingTable = (rankFromWhichToUpdate, rankingTable) => {
    // Rank is larger than the position in the ranking table by 1
    const rankingTableToUpdate = rankingTable.slice(rankFromWhichToUpdate - 1);
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