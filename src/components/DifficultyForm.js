import React from 'react';
import GameSessionContext from '../context/GameSessionContext';


class DifficultyForm extends React.Component {
    /**
     * Fetches a random article from the database and pushes the user to the component rendering the randomly picked article.
     */
    onSubmit = (e) => {
        e.preventDefault();
        // const randomArticle = await fetch('/api/randomArticle');
        const randomArticle = {
            title: 'Osijek, Croatia',
            edges: ['Hungary', 'Paris, France', 'Rijeka, Croatia'],
            distance: 1,
            path: ['Osijek, Croatia', 'Rijeka, Croatia'],
            _id: 'h18f8h1bk329r321nf32039'
        };
        return randomArticle;
    }

    render() {
        return (
            <GameSessionContext.Consumer>
                {(value) => (
                    <div>
                        <form onSubmit={(e) => {
                            const fetchedArticle = this.onSubmit(e);
                            value.setStartingArticle(fetchedArticle);
                            value.setCurrentArticle(fetchedArticle);
                            value.setGameStarted(true);
                            this.props.onSubmit(value.startingArticle);
                        }}>
                            <input type="radio" value={"easy"} name="difficulty" defaultChecked />
                            <label htmlFor="easy">Easy - unlimited hints</label>

                            <input type="radio" value={"medium"} name="difficulty" />
                            <label htmlFor="medium">Medium - distance to finish is 3 or 4 steps and 2 hint</label>

                            <input type="radio" value={"hard"} name="difficulty" />
                            <label htmlFor="hard">Hard - distance to finish is 5 steps or more and 3 hints</label>

                            <button type="submit">START</button>
                        </form>
                    </div>
                )}
            </GameSessionContext.Consumer>
        )
    }
}

export default DifficultyForm;