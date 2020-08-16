var middlewareObject = {};

middlewareObject.checkDifficulty = function (req, res, next) {
    // Set difficulty to selected difficulty
    if (req.query.difficulty) req.session.difficulty = req.query.difficulty;

    next();
};

module.exports = middlewareObject;