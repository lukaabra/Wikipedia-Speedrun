const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

router.get('/api/article/:id', async (req, res) => {
    const article = await Article.findById(req.params.id, (err, foundArticle) => {
        if (err) console.log("Get article error: " + err)
    });

    res.json(article);
});

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
                // Only add edges that are stored as articles in the database
                // A lot of the times around 20% of links are missing
                if (edgeRecord !== null)
                    articleEdges.push(edgeRecord);
            }
        });
    };

    // await updateGameSession(req);
    console.log(req.session);

    res.json(articleEdges);
});

updateGameSession = async (req) => {
    req.session.steps += 1;
    req.session.path.push(req.query.article);
    req.session.save();
};

module.exports = router;