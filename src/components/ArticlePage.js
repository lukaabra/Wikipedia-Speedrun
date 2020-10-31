import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import Article from './Article';
import Hints from './Hints';
import GameSessionContext from '../context/GameSessionContext';

class ArticlePage extends React.Component {
    static contextType = GameSessionContext;

    // Used to abort all API calls when the component unmounts
    abortController = new AbortController();

    componentDidMount() {
        if (!this.context.gameStarted) {
            this.props.history.push('/');
        } else {
            this.context.setStartTime(Date.now());
            this.encodeHint(this.state.currentArticle.path[this.state.currentArticle.path.length - 2]);
            switch (this.state.difficulty) {
                case 'easy':
                    this.setState(() => ({ numOfHints: Number.MAX_SAFE_INTEGER }));
                    break;
                case 'medium':
                    this.setState(() => ({ numOfHints: 2 }));
                    break;
                case 'hard':
                    this.setState(() => ({ numOfHints: 3 }));
                    break;
            };
        }
    };

    componentDidUpdate() {
        if (this.state.hasWon === true || this.state.hasWon === 'true')
            this.props.history.push('/submitscore');
    };

    componentWillUnmount() {
        this.abortController.abort();
    };

    state = {
        currentArticle: this.context.startingArticle,
        currentArticleEdges: this.context.startingArticleEdges,
        prevArticleEdges: this.context.startingArticleEdges,
        difficulty: this.context.difficulty,
        hasWon: false,
        numOfHints: Number.MAX_SAFE_INTEGER,
        key: Math.floor(Math.random() * 26) + 1,
        hint: '',
        showHint: false
    };

    // ADD CHECKING WINNING CONDITION AND ROUTING TO FINISHING SCREEN
    checkIfGameWon = async () => {
        try {
            const res = await fetch(`http://localhost:3001/hasWon/${this.state.currentArticle._id}`, {
                signal: this.abortController.signal,
                credentials: 'include'
            });
            const hasWon = await res.text();

            this.setState(() => ({ hasWon }));
        } catch (error) {
            console.log(`\nError in checking if following article is the finishing one:\n\t '${this.state.currentArticle.title}`);
        }
    }

    clickSurrender = (context) => {
        context.setSurrendered(true);
    };

    decodeHint = (hintToDecode) => {
        let decodedHint = '';
        hintToDecode.split('').forEach((codeChar) => {
            const code = codeChar.charCodeAt() - this.state.key;
            decodedHint += String.fromCharCode(code);
        });

        this.setState(() => ({ hint: decodedHint }));
    };

    encodeHint = (hintToEncode) => {
        let encodedHint = '';
        hintToEncode.split('').forEach((char) => {
            const code = char.charCodeAt() + this.state.key;
            encodedHint += String.fromCharCode(code);
        });

        this.setState(() => ({ hint: encodedHint }));
    };

    getArticle = async (e) => {
        const clickedArticle = this.state.currentArticleEdges.filter((edge) => {
            return edge.title === e.target.innerText
        })[0];

        this.setState(() => ({ currentArticle: clickedArticle }));
    };

    getArticleEdges = async () => {
        try {
            const payload = {
                title: this.state.currentArticle.title,
                edges: this.state.currentArticle.edges
            };
            const url = 'http://localhost:3001/article/edges';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: "include",
                signal: this.abortController.signal
            });

            if (res.status >= 400 && res.status <= 511)
                this.props.history.push('/error');

            const clickedArticleEdges = await res.json();

            this.setState(() => ({ currentArticleEdges: clickedArticleEdges }));
        } catch (error) {
            if (error === "AbortError")
                console.log("Fetch aborted");
            else
                console.log(`\nError in fetching following articles edges:\n\t '${this.state.currentArticle.title}`);
        }
    };

    getClickedArticle = async (e) => {
        e.persist();

        await this.getArticle(e);
        await this.getArticleEdges();

        // Check if the current article is not the finishing article
        if (this.state.currentArticle.path.length > 1)
            // Last item (path.length - 1) in the path array is the clickedArticle
            // Second (path.length - 2) is the hint
            this.encodeHint(this.state.currentArticle.path[this.state.currentArticle.path.length - 2]);

        this.setState(() => ({ showHint: false }));

        this.checkIfGameWon();
    };

    useHint = () => {
        if (this.state.difficulty !== 'easy') {
            this.setState((prevState) => ({ numOfHints: prevState.numOfHints - 1 }));
        }
        this.decodeHint(this.state.hint);
        this.setState(() => ({ showHint: true }));
    }

    render() {
        return (
            <div>
                <Header />
                <Article
                    getClickedArticle={this.getClickedArticle}
                    currentArticle={this.state.currentArticle}
                    currentArticleEdges={this.state.currentArticleEdges}
                />
                <Hints
                    useHint={this.useHint}
                    {...this.state}
                />
                <GameSessionContext.Consumer>
                    {(value) => (
                        <div className="article-page__container">
                            <Link to={'/finish'} className="article-page__container__link">
                                <button onClick={() => this.clickSurrender(value)} className="button">Surrender</button>
                            </Link>
                        </div>
                    )}
                </GameSessionContext.Consumer>
            </div >
        )
    }
};

export default ArticlePage;