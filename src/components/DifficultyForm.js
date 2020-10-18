import React from 'react';
import GameSessionContext from '../context/GameSessionContext';


class DifficultyForm extends React.Component {
    static contextType = GameSessionContext;

    // Set to easy since it is the default checked value
    state = {
        difficulty: 'easy'
    };

    /**
     * Fetches a random article and its edges from the database and returns them in an array.
     */
    generateRandom = () => {
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
    };

    onChange = (e) => {
        e.persist();
        this.setState(() => {
            return {
                difficulty: e.target.value
            }
        });
    };

    onSubmit = (e, context) => {
        e.preventDefault();
        const [fetchedArticle, fetchedArticleEdges] = this.generateRandom();

        context.setStartingArticle(fetchedArticle);
        context.setStartingArticleEdges(fetchedArticleEdges);
        context.setDifficulty(this.state.difficulty);
        context.setGameStarted(true);

        this.props.history.push(`/article/${fetchedArticle._id}`);
    };

    render() {
        return (
            <GameSessionContext.Consumer>
                {(value) => (
                    <div>
                        <form onSubmit={(e) => this.onSubmit(e, value)} >
                            <input type="radio" value={"easy"} name="difficulty" onChange={this.onChange} defaultChecked />
                            <label htmlFor="easy">Easy - unlimited hints</label>

                            <input type="radio" value={"medium"} name="difficulty" onChange={this.onChange} />
                            <label htmlFor="medium">Medium - distance to finish is 3 or 4 steps and 2 hint</label>

                            <input type="radio" value={"hard"} name="difficulty" onChange={this.onChange} />
                            <label htmlFor="hard">Hard - distance to finish is 5 steps or more and 3 hints</label>

                            <button type="submit">Start</button>
                        </form>
                    </div>
                )}
            </GameSessionContext.Consumer>
        )
    }
}

export default DifficultyForm;