var express = require('express')
var router = express.Router();
var Article = require('../models/articles');


// GET INDEX
router.get("/", (req, res) => {
    res.render("landing");
});

module.exports = router;