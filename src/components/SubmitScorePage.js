import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

import GameSessionContext from '../context/GameSessionContext';

class SubmitScorePage extends React.Component {
    static contextType = GameSessionContext;

    componentDidMount() {
        if (!this.context.gameStarted)
            this.props.history.push('/');

        this.setState(() => ({ runTimeMs: Date.now() - this.context.startTime }));
    };

    state = {
        name: '',
        score: {},
        error: '',
        runTimeMs: ''
    };

    goToFinish = async (e, context, toSubmitScore) => {
        if (e)
            e.preventDefault();

        // If e is present, that means that the user is trying to submit the form
        // If there is no e, that means that the user is trying to skip
        if (!this.state.name && e) {
            const error = "Please enter a name";
            this.setState(() => ({ error }));
        } else {
            await this.calculateScore(toSubmitScore);
            await context.setScore(this.state.score);

            this.props.history.push('/finish');
        }
    };

    onChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({ name }));
    };

    calculateScore = async (toSubmitScore) => {
        // Send the score to the server. The server calculates the score and saves it in the db
        const url = `http://localhost:3001/api/calculate-score/${this.context.difficulty}/${this.state.runTimeMs}?submit=${toSubmitScore}`
        const res = await fetch(url, { credentials: 'include' });
        const runScore = await res.json();

        const runTimeString = this.millisToMinutesAndSeconds(this.state.runTimeMs);

        // score, rank, userSteps, minPossibleSteps, userPath, and shortestPath is sent from the server
        const scoreObject = {
            name: this.state.name,
            startingArticle: this.context.startingArticle.title,
            time: runTimeString,
            userSteps: runScore.steps,
            minPossibleSteps: this.context.startingArticle.path.length,
            score: runScore.runScore,
            // Sent from the server
            rank: runScore.rank,
            userPath: runScore.userPath,
            // Reverse the array so it's in the same order as the users path
            shortestPath: this.context.startingArticle.path.reverse()
        };

        this.setState(() => ({ score: scoreObject }));
    };

    // https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
    millisToMinutesAndSeconds = (millis) => {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };

    render() {
        return (
            <div>
                <Header />
                <p className="submitscore__title">Would you like to submit your score?</p>
                <GameSessionContext.Consumer>
                    {(value) => (
                        <div>
                            {this.state.error && <h4 className="error">{this.state.error}</h4>}
                            <form onSubmit={(e) => this.goToFinish(e, value, true)} >
                                <input
                                    type="text"
                                    autoFocus placeholder="Your name"
                                    onChange={this.onChange}
                                    className="submitscore__form__input"
                                />
                                <button className="button" className="button">Submit score</button>
                            </form>
                            <button onClick={() => this.goToFinish(undefined, value, false)} className="button">Skip</button>
                        </div>
                    )}
                </GameSessionContext.Consumer>
            </div>
        )
    }
}

export default SubmitScorePage;