var express = require('express')
var router = express.Router();


// GET INDEX
router.get("/finish", (req, res) => {
    console.log(req.session)
    res.render("finish", {
        shortestPath: req.session.shortestPath,
        bestPossibleScore: req.session.bestPossibleScore
    });
});

module.exports = router;