import React from 'react';

const defaultContext = {
    startingArticle: {},
    startingArticleEdges: [],
    difficulty: 'easy',
    gameStarted: false,
    surrendered: false,
    score: {},
    startTime: 0
};

const GameSessionContext = React.createContext(defaultContext);

export default GameSessionContext;