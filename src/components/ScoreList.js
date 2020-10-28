import React from 'react';

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
        const scores = await res.json();

        this.setState(() => ({ scores }));
    };

    render() {
        return (
            <div>
                {
                    this.state.scores.length === 0 ? (
                        <p>Currently there are no scores to display</p>
                    ) : (
                            <div>
                                <table className="table">
                                    <thead className="table__head">
                                        <tr>
                                            <th className="table__cell">Rank</th>
                                            <th className="table__cell">Name</th>
                                            <th className="table__cell">Time</th>
                                            <th className="table__cell">Steps</th>
                                            <th className="table__cell">Min possible steps</th>
                                            <th className="table__cell">Starting article</th>
                                            <th className="table__cell">Total score</th>
                                        </tr>
                                    </thead>
                                    {
                                        this.state.scores.map((score) => (
                                            <ScoreListItem score={score} key={score._id} />
                                        ))
                                    }
                                </table>
                            </div>
                        )
                }
            </div>
        )
    }
}

export default ScoreList;