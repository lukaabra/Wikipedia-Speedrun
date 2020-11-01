const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

const winningArticleId = '5f341062eee9893534cbded3';

// Makni api
router.get('/hasWon/:id', async (req, res) => {
    if (req.params.id === winningArticleId)
        res.send(true);
    else
        res.send(false);
});

router.post('/article/edges', async (req, res) => {
    const articleTitle = req.body.title;
    const edges = req.body.edges;
    let articleEdges = [];

    for (let edge of edges) {
        const edgeRecord = await Article.findOne({
            'title': edge
        }, (err) => {
            if (err)
                console.log("Get article edge error: " + err);
        });

        articleEdges.push(edgeRecord);
    };

    await updateGameSession(req, articleTitle);
    res.json(articleEdges);
});

// Route for testing
router.get('/api/:title', async (req, res) => {
    await Article.findOne({
        'title': req.params.title
    }, (error, foundArticle) => {
        if (error)
            res.send(error)
        else
            res.json(foundArticle)
    })
});

updateGameSession = async (req, articleTitle) => {
    req.session.steps += 1;
    req.session.path.push(articleTitle);
    req.session.save();
};

module.exports = router;