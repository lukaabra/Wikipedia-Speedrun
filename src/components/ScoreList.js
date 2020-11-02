import React from 'react';

import ScoreListHead from './ScoreListHead';
import ScoreListItem from './ScoreListItem';
import LoadingComponent from './LoadingComponent';

class ScoreList extends React.Component {
    constructor(props) {
        super(props);
    };

    state = {
        scores: [],
        isLoaded: false
    };

    async componentDidMount() {
        await this.getScores();
    }

    getScores = async () => {
        const res = await fetch(`/score-table?topThree=${this.props.topThree}`);

        if (res.status >= 400 && res.status <= 511)
            this.props.history.push('/error');
        else {
            const scores = await res.json();
            this.setState(() => ({ scores }));
            this.setState(() => ({ isLoaded: true }));
        }
    };

    render() {
        return (
            <div>
                {
                    this.state.isLoaded ? (
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
                    ) : (
                            <LoadingComponent />
                        )
                }
            </div>
        )
    }
}

export default ScoreList;