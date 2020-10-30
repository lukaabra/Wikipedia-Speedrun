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
        updateGameSession(req, article.title);
        res.send(false);
    }
});

router.get('/article/:id', async (req, res) => {
    await Article.findById(req.params.id, (error, foundArticle) => {
        if (error)
            res.send(error)
        else
            res.json(foundArticle)
    })
});

router.get('/title/:title', async (req, res) => {
    await Article.findOne({
        'title': req.params.title
    }, (error, foundArticle) => {
        if (error)
            res.send(error)
        else
            res.json(foundArticle)
    })
});

router.get('/api/article/edges/:edges/:article', async (req, res) => {
    const edges = req.params.edges.split(',');
    const articleTitle = req.params.article;
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
                // else
                //     console.log(`EDGE THAT IS NULL: ${edges}, ${edge}`);
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