const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

const winningArticleId = '5f341062eee9893534cbded3';

// Makni api
router.get('/hasWon/:id', async (req, res) => {
    if (req.params.id === winningArticleId) {
        res.send(true);
    } else {
        const article = await Article.findById(req.params.id, (error) => {
            if (error)
                console.log('Get article error: ' + error);
        })
        // updateGameSession(req, article.title);
        res.send(false);
    }
});

router.get('api/:title', async (req, res) => {
    await Article.findOne({
        'title': req.params.title
    }, (error, foundArticle) => {
        if (error)
            res.send(error)
        else
            res.json(foundArticle)
    })
});

router.post('/article/edges', async (req, res) => {
    const articleTitle = req.body.title;
    const edges = req.body.edges;
    let articleEdges = [];

    for (let edge of edges) {
        await Article.findOne({
            'title': edge
        }, (err, edgeRecord) => {
            if (err) {
                console.log("Get article edge error: " + err);
            } else {
                if (edgeRecord !== null)
                    articleEdges.push(edgeRecord);
                else
                    console.log(`EDGE THAT IS NULL: ${edge}`);
            }
        });
    };

    await updateGameSession(req, articleTitle);
    res.json(articleEdges);
});

updateGameSession = async (req, articleTitle) => {
    req.session.steps += 1;
    req.session.path.push(articleTitle);
    req.session.save();
};

module.exports = router;