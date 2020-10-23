import React from 'react';
import { Link } from 'react-router-dom';

import ScoreList from './ScoreList';

import GameSessionContext from '../context/GameSessionContext';

const title = 'Wikipedia Speedrun'
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
            <div>
                <h1>{title}</h1>
                <h3>{subtitle}</h3>
                <Link to={'/instructions'}><p>Play</p></Link>
                <Link to={'/ranks'}><p>Ranks</p></Link>
                <ScoreList topThree={true} />
            </div>
        );
    };
};

export default HomePage;