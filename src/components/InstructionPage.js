import React from 'react';

import Header from './Header';
import DifficultyForm from './DifficultyForm';
import GameSessionContext from '../context/GameSessionContext';

class InstructionPage extends React.Component {
    static contextType = GameSessionContext;

    onSubmit = (startingArticle) => {
        this.props.history.push(`/article/${startingArticle._id}`);
    }

    render() {
        return (
            <div>
                <Header />
                <p>
                    The goal of the game is to reach the Wikipedia article for <span><a
                        href="https://en.wikipedia.org/wiki/Rijeka">Rijeka, Croatia</a></span> only by clicking the links of
                    each article in the shortest amount of
                    steps possible.
                </p>
                <p>
                    You will be assigned to a random article. All of the articles have links by which you navigate. The maximum
                    distance to the finish (Rijeka article) is 7 steps.
                </p>
                <DifficultyForm onSubmit={this.onSubmit} />
            </div>
        )
    }

};

export default InstructionPage;