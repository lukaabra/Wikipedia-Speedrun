var express = require('express')
var router = express.Router();
var Score = require('../models/scores');


// GET TOP SCORES
router.get("/topscores", (req, res) => {
    res.render("topscores");
});

module.exports = router;