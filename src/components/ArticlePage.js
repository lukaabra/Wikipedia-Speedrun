import React from 'react';

import Header from './Header';
import GameSessionContext from '../context/GameSessionContext';

class ArticlePage extends React.Component {
    static contextType = GameSessionContext;

    render() {
        return (
            <div>
                <Header />
                <h3>{this.context.currentArticle.title}</h3>
            </div>
        )
    }
};

export default ArticlePage;