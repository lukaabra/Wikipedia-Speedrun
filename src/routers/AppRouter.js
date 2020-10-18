import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from '../components/HomePage';
import InstructionPage from '../components/InstructionPage';
import ArticlePage from '../components/ArticlePage';
import NotFoundPage from '../components/NotFoundPage';

import GameSessionContext from '../context/GameSessionContext';

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startingArticle: {
                title: '',
                edges: [],
                distance: 0,
                path: '',
                _id: ''
            },
            startingArticleEdges: [],
            gameStarted: false,
            setStartingArticle: this.setStartingArticle,
            setStartingArticleEdges: this.setStartingArticleEdges,
            setGameStarted: this.setGameStarted
        }
    };

    setStartingArticle = (startingArticle) => {
        this.setState({ startingArticle });
    };

    setStartingArticleEdges = (edges) => {
        this.setState(() => {
            return {
                startingArticleEdges: edges
            }
        })
    };

    setGameStarted = (gameStarted) => {
        this.setState({ gameStarted });
    };

    render() {
        return (
            <GameSessionContext.Provider value={this.state}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" component={HomePage} exact={true} />
                        <Route path="/instructions" component={InstructionPage} exact={true} />
                        <Route path="/article/:id" component={ArticlePage} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </BrowserRouter>
            </GameSessionContext.Provider>
        );
    }
}

export default AppRouter;