import React from 'react';

const FinalScore = (props) => (
    <div>
        {
            props.score.name && (
                <div>
                    <h1>{props.score.name}</h1>
                    <p>Your score has been submitted</p>
                </div>
            )
        }

        <h3>Starting Article:</h3>
        <p>{props.score.startingArticle}</p>

        <h3>Time:</h3>
        <p>{props.score.time}</p>

        <h3>Your steps:</h3>
        <p>{props.score.userSteps}</p>

        <h3>Minimum possible steps:</h3>
        <p>{props.score.minPossibleSteps}</p>

        <h1>Your score:</h1>
        <p>{props.score.score}</p>

        <h1>Your rank:</h1>
        <p>{props.score.rank}</p>

        <h4>Your path:</h4>
        <ul>
            {
                Object.values(props.score.userPath).map((article) => (
                    <li>{article}</li>
                ))
            }
        </ul>

        <h4>Shortest possible path:</h4>
        <ul>
            {
                Object.values(props.score.shortestPath).map((article) => (
                    <li>{article}</li>
                ))
            }
        </ul>
    </div>
);

export default FinalScore;