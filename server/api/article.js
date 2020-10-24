const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

const winningArticleId = '5f341062eee9893534cbded3';

router.get('/api/article/:id', async (req, res) => {
    if (req.params.id === winningArticleId) {
        res.send(true);
    } else {
        const article = await Article.findById(req.params.id, (error) => {
            if (error)
                console.log('Get article error: ' + error);
        })
        // TODO: Fix Session not being remembered
        // updateGameSession(req, article);
        res.send(false);
    }
});

updateGameSession = async (req, article) => {
    req.session.steps += 1;
    // req.session.path.push(article.title);
    req.session.save();
};

router.get('/api/article/edges/:edges', async (req, res) => {
    const edges = req.params.edges.split(',');
    let articleEdges = [];

    for (let edge of edges) {
        await Article.findOne({
            'title': edge
        }, (err, edgeRecord) => {
            if (err) {
                console.log("Get article edge error: " + err);
            } else {
                // TODO: A lot of the times around 20% of links are missing
                if (edgeRecord !== null)
                    articleEdges.push(edgeRecord);
            }
        });
    };

    await updateGameSession(req);
    console.log(req.session);

    res.json(articleEdges);
});

module.exports = router;