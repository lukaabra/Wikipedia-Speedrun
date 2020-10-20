import React from 'react';

const ScoreListItem = (props) => (
    <div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Time</th>
                    <th>Steps</th>
                    <th>Min possible steps</th>
                    <th>Starting article</th>
                    <th>Total score</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {
                        Object.values(props.score).map((data, index) => (
                            <td key={props.score.score * index}>{data}</td>
                        ))
                    }
                </tr>
            </tbody>
        </table>
    </div>
);

export default ScoreListItem;