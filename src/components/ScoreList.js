import React from 'react';

import ScoreListItem from './ScoreListItem';

const ScoreList = (props) => (
    <div>
        {
            props.scores.length === 0 ? (
                <p>Currently there are no scores to show</p>
            ) : (
                    props.topThree ? (
                        props.scores.slice(0, 3).map((score) => (
                            <ScoreListItem score={score} />
                        ))
                    ) : (
                            props.scores.map((score) => (
                                <ScoreListItem score={score} />
                            ))
                        )
                )
        }
    </div>
);

export default ScoreList;