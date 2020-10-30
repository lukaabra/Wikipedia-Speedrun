import React from 'react';

class ScoreListHead extends React.Component {
    render() {
        if (window.innerWidth > 569) {
            return (
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
            )
        } else {
            return (
                <thead className="table__head">
                    <tr>
                        <th className="table__cell">Rank</th>
                        <th className="table__cell">Name</th>
                        <th className="table__cell">Steps</th>
                        <th className="table__cell">Total score</th>
                    </tr>
                </thead>
            )
        }
    }
};

export default ScoreListHead;