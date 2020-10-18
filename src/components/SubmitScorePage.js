import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

import GameSessionContext from '../context/GameSessionContext';

class SubmitScorePage extends React.Component {
    static contextType = GameSessionContext;

    state = {
        name: '',
        score: {}
    };

    onSubmit = async (e, context) => {
        e.preventDefault();

        await this.getScore();
        await context.setScore(this.state.score);

        this.props.history.push('/finish');
    };

    onChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({ name }));
    };

    getScore = async () => {
        // POST method to the server with the session data to save data to databse
        // GET method to receive the calculated score
        const score = {
            name: this.state.name,
            time: '0:28',
            steps: 8,
            minPossibleSteps: 6,
            startingArticle: 'Osijek, Croatia',
            score: 198
        };
        this.setState(() => ({ score }));
    }

    render() {
        return (
            <div>
                <Header />
                <p>Would you like to submit your score?</p>
                <GameSessionContext.Consumer>
                    {(value) => (
                        <form onSubmit={(e) => this.onSubmit(e, value)}>
                            <input type="text" autoFocus placeholder="Your name" onChange={this.onChange} />
                            <button>Submit score</button>
                        </form>
                    )}
                </GameSessionContext.Consumer>
                <Link to={'/finish'}>
                    <button>Skip</button>
                </Link>
            </div>
        )
    }
}

export default SubmitScorePage;