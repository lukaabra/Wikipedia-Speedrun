import React from 'react';
import { Link } from 'react-router-dom';

import ScoreList from './ScoreList';

const title = 'Wikipedia Speedrun'
const subtitle = 'Reach the Wikipedia article for the city of Rijeka, Croatia as fast as you can!'
const scores = [{
    name: 'Luka',
    time: '0:28',
    steps: 8,
    minPossibleSteps: 6,
    startingArticle: 'Osijek, Croatia',
    score: 198
}];

const HomePage = () => (
    <div>
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
        <Link to={'/instructions'}><p>Play</p></Link>
        <ScoreList scores={scores} topThree={true} />
    </div>
);

export default HomePage;