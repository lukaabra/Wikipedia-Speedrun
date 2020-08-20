var express = require('express')
var router = express.Router();


// GET INDEX
router.get("/finish", (req, res) => {
    res.render("finish");
});

module.exports = router;