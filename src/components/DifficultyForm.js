import React from 'react';
import GameSessionContext from '../context/GameSessionContext';


class DifficultyForm extends React.Component {
    /**
     * Fetches a random article and its edges from the database and returns them in an array.
     */
    generateRandom = (e) => {
        e.preventDefault();
        // const randomArticle = await fetch('/api/randomArticle');
        const randomArticle = {
            title: 'Osijek, Croatia',
            edges: ['Hungary', 'Paris, France'],
            distance: 1,
            path: ['Osijek, Croatia', 'Rijeka, Croatia'],
            _id: 'h18f8h1bk329r321nf32039'
        };
        const randomArticleEdges = [
            {
                title: 'Hungary',
                edges: ['Hungary', 'Paris, France', 'Rijeka, Croatia'],
                distance: 1,
                path: ['Osijek, Croatia', 'Rijeka, Croatia'],
                _id: 'h18gds23153fe1f'
            },
            {
                title: 'Paris',
                edges: ['Hungary', 'Paris, France', 'Rijeka, Croatia'],
                distance: 1,
                path: ['Osijek, Croatia', 'Rijeka, Croatia'],
                _id: 'h18gds235353t4ffr3153fe1f'
            },
            {
                title: 'France',
                edges: ['Hungary', 'Paris, France', 'Rijeka, Croatia'],
                distance: 1,
                path: ['Osijek, Croatia', 'Rijeka, Croatia'],
                _id: 'h18gds231buidwqov791hcnew53fe1f'
            }
        ];

        return [randomArticle, randomArticleEdges];
    }

    render() {
        return (
            <GameSessionContext.Consumer>
                {(value) => (
                    <div>
                        <form onSubmit={
                            (e) => {
                                const [fetchedArticle, fetchedArticleEdges] = this.generateRandom(e);
                                value.setStartingArticle(fetchedArticle);
                                value.setStartingArticleEdges(fetchedArticleEdges);
                                value.setGameStarted(true);
                                this.props.onSubmit(fetchedArticle);
                            }
                        }>
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