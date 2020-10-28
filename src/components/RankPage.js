import React from 'react';


import Header from './Header';
import ScoreList from './ScoreList';

class RankPage extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <h3 className="submitscore__title">Top 100 ranks</h3>
                <ScoreList topThree={false} />
            </div>
        );
    };
};

export default RankPage;