import React from 'react';
import { Link } from 'react-router-dom';

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
        this.getShortestPath();
    };

    getShortestPath = () => {
        if (this.state.surrendered) {
            const shortestPath = this.context.startingArticle.path;
            this.setState(() => ({ shortestPath }));
        }
    }

    render() {
        return (
            <div>
                <h2>{this.state.surrendered ? 'You surrendered' : 'Congratulations!'}</h2>
                {!this.state.surrendered && <FinalScore score={this.state.score} />}
                {
                    this.state.surrendered &&
                    <div>
                        <h4>The shortest possible path was:</h4>
                        <ul>
                            {this.state.shortestPath.map((article) => (
                                <li key={article}>{article}</li>
                            ))}
                        </ul>
                    </div>
                }
                <Link to={'/'}>
                    <button>Home</button>
                </Link>
            </div>
        )
    }
};

export default FinishPage;