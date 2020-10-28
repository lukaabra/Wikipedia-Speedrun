import React from 'react';

const FinalScore = (props) => (
    <div className="final-score">
        {
            props.score.name && (
                <div>
                    <h1 className="final-score__name">{props.score.name}</h1>
                    <p>Your score has been submitted</p>
                </div>
            )
        }

        <h3 className="final-score__starting-article">Starting Article:</h3>
        <p>{props.score.startingArticle}</p>

        <h3 className="final-score__title">Time:</h3>
        <p>{props.score.time}</p>

        <h3 className="final-score__title">Your steps:</h3>
        <p>{props.score.userSteps}</p>

        <h3 className="final-score__title">Minimum possible steps:</h3>
        <p>{props.score.minPossibleSteps}</p>

        <h1 className="final-score__score">Your score:</h1>
        <p>{props.score.score}</p>

        <h1 className="final-score__rank">Your rank:</h1>
        <p className="final-score__rank-number">{props.score.rank}</p>

        <h4 className="final-score__title">Your path:</h4>
        <ul className="final-score__path">
            {
                Object.values(props.score.userPath).map((article) => (
                    <li key={article}>{article}</li>
                ))
            }
        </ul>

        <h4 className="final-score__title">Shortest possible path:</h4>
        <ul className="final-score__path">
            {
                Object.values(props.score.shortestPath).map((article, index) => (
                    <li key={index}>{article}</li>
                ))
            }
        </ul>
    </div>
);

export default FinalScore;