import React from 'react';

const ScoreListItem = (props) => (
    <tbody>
        <tr>
            <td key={props.score.rank} className="score-list-item-cell">{props.score.rank}.</td>
            <td key={props.score.name} className="score-list-item-cell">{props.score.name}</td>
            <td key={props.score.time} className="score-list-item-cell">{props.score.time}</td>
            <td key={props.score.steps * props.score.score} className="score-list-item-cell">{props.score.steps}</td>
            <td key={props.score.minPossibleSteps + props.score.score} className="score-list-item-cell">{props.score.minPossibleSteps}</td>
            <td key={props.score.startingArticle} className="score-list-item-cell">{props.score.startingArticle}</td>
            <td key={props.score.score} className="score-list-item-cell">{props.score.score}</td>
        </tr>
    </tbody>
);

export default ScoreListItem;