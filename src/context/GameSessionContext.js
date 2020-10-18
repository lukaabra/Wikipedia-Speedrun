import React from 'react';

const defaultContext = {
    startingArticle: {},
    startingArticleEdges: [],
    difficulty: 'easy',
    gameStarted: false,
    surrendered: false,
};

const GameSessionContext = React.createContext(defaultContext);

export default GameSessionContext;