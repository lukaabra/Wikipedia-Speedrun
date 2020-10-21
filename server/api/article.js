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
        let edgeRecord = await Article.findOne({
            'title': edge
        }, (err) => {
            if (err) console.log("Get article edge error: " + err)
        });

        articleEdges.push(edgeRecord);
    };

    res.json(articleEdges);
});

module.exports = router;