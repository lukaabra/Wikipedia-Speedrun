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

        const payload = {
            title: randomArticle.title,
            edges: randomArticle.edges
        };
        url = 'http://localhost:3001/article/edges';
        res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: "include"
        });

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
                        <form onSubmit={(e) => this.onSubmit(e, value)} className="difficulty-form">
                            <input type="radio" value={"easy"} name="difficulty" onChange={this.onChange} defaultChecked />
                            <label htmlFor="easy" className="difficulty-form__label">Easy - unlimited hints</label>

                            <input type="radio" value={"medium"} name="difficulty" onChange={this.onChange} />
                            <label htmlFor="medium" className="difficulty-form__label">Medium - distance to finish is 3 or 4 steps and 2 hint</label>

                            <input type="radio" value={"hard"} name="difficulty" onChange={this.onChange} />
                            <label htmlFor="hard" className="difficulty-form__label">Hard - distance to finish is 5 steps or more and 3 hints</label>

                            <button type="submit" className="button">Start</button>
                        </form>
                    </div>
                )}
            </GameSessionContext.Consumer>
        )
    }
}

export default DifficultyForm;