import React from 'react';

const Hints = (props) => (
    <div>
        {props.showHint && <p>{props.hint}</p>}
        {
            props.difficulty === 'easy' ? (
                <p>Infinite hints left</p>
            ) : (
                    <p>{props.numOfHints} {props.numOfHints === 1 ? 'hint' : 'hints'} left</p>
                )
        }
        <button onClick={props.useHint} disabled={!props.numOfHints || props.showHint}>Use hint</button>
    </div>
);

export default Hints;