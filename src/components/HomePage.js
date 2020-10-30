import React from 'react';
import { Link } from 'react-router-dom';

import ScoreList from './ScoreList';

import GameSessionContext from '../context/GameSessionContext';
import Header from './Header';

const subtitle = 'Reach the Wikipedia article for the city of Rijeka, Croatia as fast as you can!'

class HomePage extends React.Component {
    static contextType = GameSessionContext;

    componentDidMount() {
        this.context.setStartingArticle({});
        this.context.setStartingArticleEdges([]);
        this.context.setScore({});
        this.context.setDifficulty('easy');
        this.context.setGameStarted(false);
        this.context.setSurrendered(false);
    };

    render() {
        return (
            <div className="home">
                <Header subtitle={subtitle} />
                <div className="home__link-container">
                    <Link to={'/instructions'} className="home__link-container__link">
                        <p className="button">Play</p>
                    </Link>
                </div>
                <div className="home__link-container">
                    <Link to={'/ranks'} className="home__link-container__link">
                        <p className="button">Ranks</p>
                    </Link>
                </div>
                <ScoreList topThree={true} />
            </div>
        );
    };
};

export default HomePage;