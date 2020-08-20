var express = require('express')
var router = express.Router();


// GET TOP SCORES
router.get("/topscores", (req, res) => {
    res.render("topscores");
});

module.exports = router;