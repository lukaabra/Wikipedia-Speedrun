import React from 'react';

import Header from './Header';
import DifficultyForm from './DifficultyForm';
import Footer from './Footer';

class InstructionPage extends React.Component {

    render() {
        return (
            <div>
                <Header />
                <div className="instructions">
                    <p>
                        The goal of the game is to reach the Wikipedia article for <span><a
                            href="https://en.wikipedia.org/wiki/Rijeka" target="_blank" className="instructions__link">Rijeka, Croatia</a></span> only by clicking the links of
                each article in the shortest amount of
                steps possible.
                    </p>
                    <p>
                        You will be assigned to a random article. All of the articles have links by which you navigate. The maximum
                        distance to the finish (Rijeka article) is 7 steps.
                    </p>
                </div>
                <DifficultyForm history={this.props.history} />
                <Footer />
            </div>
        )
    }

};

export default InstructionPage;