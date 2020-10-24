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
    generateRandom = async () => {
        let url = `http://localhost:3001/api/generate-random/${this.state.difficulty}`;
        let res = await fetch(url, { credentials: 'include' });
        const randomArticle = await res.json();

        url = `http://localhost:3001/api/article/edges/${randomArticle.edges}/${randomArticle.title}`;
        res = await fetch(url, { credentials: 'include' });
        const randomArticleEdges = await res.json();

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

    onSubmit = async (e, context) => {
        e.preventDefault();
        const [fetchedArticle, fetchedArticleEdges] = await this.generateRandom();

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