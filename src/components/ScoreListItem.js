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
                    <td key={props.score.name}>{props.score.name}</td>
                    <td key={props.score.time}>{props.score.time}</td>
                    <td key={props.score.steps * props.score.score}>{props.score.steps}</td>
                    <td key={props.score.minPossibleSteps + props.score.score}>{props.score.minPossibleSteps}</td>
                    <td key={props.score.startingArticle}>{props.score.startingArticle}</td>
                    <td key={props.score.score}>{props.score.score}</td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default ScoreListItem;