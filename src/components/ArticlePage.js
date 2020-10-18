import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import GameSessionContext from '../context/GameSessionContext';

class ArticlePage extends React.Component {
    static contextType = GameSessionContext;

    render() {
        return (
            <div>
                <Header />
                <h4>{this.context.currentArticle.title}</h4>
                {
                    this.context.currentArticleEdges.map((edge) => (
                        <Link to={`/article/${edge._id}`}>{edge.title}</Link>
                    ))
                }
            </div>
        )
    }
};

export default ArticlePage;