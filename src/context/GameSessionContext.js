import React from 'react';

const defaultContext = {
    startingArticle: {
        title: '',
        edges: [],
        distance: 0,
        path: '',
        id: ''
    },
    currentArticle: {
        title: '',
        edges: [],
        distance: 0,
        path: '',
        id: ''
    },
    gameStarted: false
};

const GameSessionContext = React.createContext(defaultContext);

export default GameSessionContext;