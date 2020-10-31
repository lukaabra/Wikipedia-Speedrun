import React from 'react';

import ScoreListHead from './ScoreListHead';
import ScoreListItem from './ScoreListItem';

class ScoreList extends React.Component {
    constructor(props) {
        super(props);
    };

    state = {
        scores: []
    };

    async componentDidMount() {
        await this.getScores();
    }

    getScores = async () => {
        const res = await fetch(`http://localhost:3001/api/score-table?topThree=${this.props.topThree}`);
        if (res.status >= 400 && res.status <= 511)
            this.props.history.push('/error');
        else {
            const scores = await res.json();
            this.setState(() => ({ scores }));
        }
    };

    render() {
        return (
            <div>
                {
                    this.state.scores.length === 0 ? (
                        <p className="no-scores">Currently there are no scores to display</p>
                    ) : (
                            <div>
                                <table className="table">
                                    <ScoreListHead />
                                    <tbody>
                                        {
                                            this.state.scores.map((score) => (
                                                <ScoreListItem score={score} key={score._id} />
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                }
            </div>
        )
    }
}

export default ScoreList;