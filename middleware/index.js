var Article = require('../models/articles');

var middlewareObject = {};

middlewareObject.trackHints = function (req, res, next) {
    if (req.query.hints) req.session.hints -= 1;
    if (req.session.hints < 0) req.session.hints = 0

    next();
}

middlewareObject.setHints = function (req, res, next) {
    switch (req.query.difficulty) {
        case 'easy':
            req.session.hints = 10000;
            break;
        case 'medium':
            req.session.hints = 2;
            break;
        case 'hard':
            req.session.hints = 3;
            break;
    }

    next();
}

module.exports = middlewareObject;