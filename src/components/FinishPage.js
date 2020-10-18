import React from 'react';
import { Link } from 'react-router-dom';

import FinalScore from './FinalScore';

import GameSessionContext from '../context/GameSessionContext';

class FinishPage extends React.Component {
    static contextType = GameSessionContext;

    state = {
        surrendered: this.context.surrendered
    };

    render() {
        return (
            <div>
                <h2>{this.state.surrendered ? 'You surrendered' : 'Congratulations!'}</h2>
                {this.state.surrendered && <p>Your score until you surrendered:</p>}
                <FinalScore score={this.context.score} />
                <Link to={'/'}>
                    <button>Home</button>
                </Link>
            </div>
        )
    }
};

export default FinishPage;