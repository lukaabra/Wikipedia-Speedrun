import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import GameSessionContext from '../context/GameSessionContext';

class ArticlePage extends React.Component {
    static contextType = GameSessionContext;

    state = {
        currentArticle: this.context.startingArticle,
        currentArticleEdges: this.context.startingArticleEdges
    }

    getClickedArticle = (e) => {
        e.persist();
        const clickedArticle = this.state.currentArticleEdges.filter((edge) => {
            return edge.title === e.target.innerText
        })[0];
        // Fetch clicked Article edges
        const clickedArticleEdges = [{
            title: 'fdsafds',
            edges: ['fdsafdsa', 'Pfaris, Franfdsaghce'],
            distance: 1,
            path: ['Osijek, Croatia', 'Rijeka, Croatia'],
            _id: 'h18f8h1bk32gdsagdsa9r321nf32039'
        }];
        this.setState(() => {
            return {
                currentArticle: clickedArticle,
                currentArticleEdges: clickedArticleEdges
            }
        });
    };

    render() {
        return (
            <div>
                <Header />
                <h4>{this.state.currentArticle.title}</h4>
                {
                    this.state.currentArticleEdges.map((edge) => (
                        <div>
                            <Link to={`/article/${edge._id}`} onClick={this.getClickedArticle}>{edge.title}</Link>
                             - {edge.edges.length} links
                        </div>
                    ))
                }
            </div>
        )
    }
};

export default ArticlePage;