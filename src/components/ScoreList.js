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
                            this.props.topThree ? (
                                this.state.scores.slice(0, 3).map((score) => (
                                    <ScoreListItem score={score} key={score._id} />
                                ))
                            ) : (
                                    this.state.scores.map((score) => (
                                        <ScoreListItem score={score} key={score._id} />
                                    ))
                                )
                        )
                }
            </div>
        )
    }
}

export default ScoreList;