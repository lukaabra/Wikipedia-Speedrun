const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

router.get('/api/generate-random/:difficulty', async (req, res) => {
    const randomArticle = await generateRandomArticle(req.params.difficulty);
    res.json(randomArticle[0]);
});

//==================================================
//              HELPER FUNCTIONS
//==================================================

// Returns an object inside of an array, wrapped in a Promise --> Promise( [{...}] )
generateRandomArticle = async (difficulty) => {

    let distGT, distLT;
    switch (difficulty) {
        case 'easy':
            distGT = 1;
            distLT = 8
            break;
        case 'medium':
            distGT = 2;
            distLT = 5;
            break;
        case 'hard':
            distGT = 4;
            distLT = 8;
            break;
    };

    // Returns a Promise
    const randomArticle = await Article.aggregate().match({
        "distance": { // Check if distance is in accordance with the selected difficulty
            "$gt": distGT,
            "$lt": distLT
        }
    }).sample(1).exec();

    return randomArticle;
};

module.exports = router;