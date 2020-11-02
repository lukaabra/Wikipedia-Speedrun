import React from 'react';

import LoadingComponent from './LoadingComponent';
import GameSessionContext from '../context/GameSessionContext';

class DifficultyForm extends React.Component {
    static contextType = GameSessionContext;

    // Set to easy since it is the default checked value
    state = {
        difficulty: 'easy',
        isLoaded: true
    };

    /**
     * Fetches a random article and its edges from the database and returns them in an array.
     */
    generateRandom = async () => {
        this.setState(() => ({ isLoaded: false }));

        let url = `/generateRandom/${this.state.difficulty}`;
        let res = await fetch(url, { credentials: 'include' });

        if (res.status >= 400 && res.status <= 511)
            this.props.history.push('/error');

        const randomArticle = await res.json();

        const payload = {
            title: randomArticle.title,
            edges: randomArticle.edges
        };
        url = '/article/edges';

        res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: "include"
        });

        if (res.status >= 400 && res.status <= 511)
            this.props.history.push('/error');
        else
            this.setState(() => ({ isLoaded: true }));

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
                        {
                            this.state.isLoaded ? (
                                <form onSubmit={(e) => this.onSubmit(e, value)} className="difficulty-form">
                                    <input type="radio" value={"easy"} name="difficulty" onChange={this.onChange} defaultChecked />
                                    <label htmlFor="easy" className="difficulty-form__label">Easy - unlimited hints</label>

                                    <input type="radio" value={"medium"} name="difficulty" onChange={this.onChange} />
                                    <label htmlFor="medium" className="difficulty-form__label">Medium - distance to finish is 3 or 4 steps and 2 hint</label>

                                    <input type="radio" value={"hard"} name="difficulty" onChange={this.onChange} />
                                    <label htmlFor="hard" className="difficulty-form__label">Hard - distance to finish is 5 steps or more and 3 hints</label>

                                    <button type="submit" className="button">Start</button>
                                </form>
                            ) : (
                                    <LoadingComponent />
                                )
                        }
                    </div>
                )}
            </GameSessionContext.Consumer>
        )
    }
}

export default DifficultyForm;