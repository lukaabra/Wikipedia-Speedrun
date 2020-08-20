var middlewareObject = {};

const FINISH_ARTICLE_ID = '5f341062eee9893534cbded3';

middlewareObject.checkWinningCondition = function (req, res, next) {
    if (req.params.id != FINISH_ARTICLE_ID) {
        return next();
    } else {
        res.redirect('/finish');
    }
}

middlewareObject.trackHints = function (req, res, next) {
    if (req.query.hints) {
        req.session.hints--;
        // Decrement the user score because it will automatically be incremented in the get route for 'play/:id'
        // Decrementing it here means that the user didn't click on any article, only that he/she took a hint
        req.session.userScore--;
        // Pop the last element of userPath for the same reason userScore is decremented
        req.session.userPath.pop();
    }
    if (req.session.hints < 0) req.session.hints = 0

    next();
}

middlewareObject.setHints = function (req, res, next) {
    req.session.difficulty = req.query.difficulty;
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