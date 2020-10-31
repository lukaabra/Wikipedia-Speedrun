import React from 'react';

import Header from './Header';
import FinalScore from './FinalScore';

import GameSessionContext from '../context/GameSessionContext';

class FinishPage extends React.Component {
    static contextType = GameSessionContext;

    state = {
        surrendered: this.context.surrendered,
        score: this.context.score,
        shortestPath: []
    };

    componentDidMount() {
        if (!this.context.gameStarted)
            this.props.history.push('/');

        this.getShortestPath();
    };

    getShortestPath = () => {
        if (this.state.surrendered) {
            const shortestPath = this.context.startingArticle.path.reverse();
            this.setState(() => ({ shortestPath }));
        }
    }

    render() {
        return (
            <div>
                <Header />
                <h2 className="finish__title">{this.state.surrendered ? 'You surrendered' : 'Congratulations!'}</h2>
                {!this.state.surrendered && this.context.gameStarted && <FinalScore score={this.state.score} />}
                {
                    this.state.surrendered &&
                    <div className="finish__surrender-path">
                        <h4 className="finish__surrender-path__title">The shortest possible path was:</h4>
                        <ul>
                            {this.state.shortestPath.map((article) => (
                                <li key={article}>{article}</li>
                            ))}
                        </ul>
                    </div>
                }
            </div>
        )
    }
};

export default FinishPage;