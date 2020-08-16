var express = require('express')
var router = express.Router();


// GET INDEX
router.get("/", (req, res) => {
    res.render("landing");
});

module.exports = router;