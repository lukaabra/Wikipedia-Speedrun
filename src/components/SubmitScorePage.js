import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

import GameSessionContext from '../context/GameSessionContext';

class SubmitScorePage extends React.Component {
    static contextType = GameSessionContext;

    componentDidMount() {
        this.setState(() => ({ runTime: this.millisToMinutesAndSeconds(Date.now() - this.context.startTime) }));
    };

    state = {
        name: '',
        score: {},
        error: '',
        runTime: ''
    };

    goToFinish = async (e, context) => {
        if (e)
            e.preventDefault();

        // If e is present, that means that the user is trying to submit the form
        // If there is no e, that means that the user is trying to skip
        if (!this.state.name && e) {
            const error = "Please enter a name";
            this.setState(() => ({ error }));
        } else {
            await this.getScore();
            await context.setScore(this.state.score);

            // if (e)
            // await this.postScore();

            this.props.history.push('/finish');
        }
    };

    onChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({ name }));
    };

    getScore = async () => {
        // GET method to receive the calculated score

        // score, rank, userSteps, minPossibleSteps, userPath, and shortestPath is sent from the server
        const score = {
            name: this.state.name,
            startingArticle: 'Osijek, Croatia',
            time: '0:28',
            userSteps: 8,
            minPossibleSteps: 6,
            score: 198,
            rank: 0,
            userPath: ['gdjskagh', 'htuiewhge', 'hjfkelsag'],
            shortestPath: ['ghsduagh', 'ghdjsahgd', 'gjdksaghsd']
        };
        this.setState(() => ({ score }));
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
                <p>Would you like to submit your score?</p>
                <GameSessionContext.Consumer>
                    {(value) => (
                        <div>
                            {this.state.error && <h4>{this.state.error}</h4>}
                            <form onSubmit={(e) => this.goToFinish(e, value)}>
                                <input type="text" autoFocus placeholder="Your name" onChange={this.onChange} />
                                <button>Submit score</button>
                            </form>
                            <button onClick={() => this.goToFinish(undefined, value)}>Skip</button>
                        </div>
                    )}
                </GameSessionContext.Consumer>
            </div>
        )
    }
}

export default SubmitScorePage;