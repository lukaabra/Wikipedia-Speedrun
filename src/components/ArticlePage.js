import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import Article from './Article';
import Hints from './Hints';
import GameSessionContext from '../context/GameSessionContext';

class ArticlePage extends React.Component {
    static contextType = GameSessionContext;

    componentDidMount() {
        if (!this.context.gameStarted) {
            this.props.history.push('/');
        } else {
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
        if (this.state.hasWon)
            this.props.history.push('/submitscore');
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

    clickSurrender = (context) => {
        context.setSurrendered(true);
    }

    encodeHint = (hintToEncode) => {
        let encodedHint = '';
        hintToEncode.split('').forEach((char) => {
            const code = char.charCodeAt() + this.state.key;
            encodedHint += String.fromCharCode(code);
        });

        this.setState(() => ({ hint: encodedHint }));
    };

    decodeHint = (hintToDecode) => {
        let decodedHint = '';
        console.log(hintToDecode)
        hintToDecode.split('').forEach((codeChar) => {
            const code = codeChar.charCodeAt() - this.state.key;
            decodedHint += String.fromCharCode(code);
        });

        console.log(decodedHint);

        this.setState(() => ({ hint: decodedHint }));
    }

    getClickedArticle = (e) => {
        e.persist();
        const clickedArticle = this.state.currentArticleEdges.filter((edge) => {
            return edge.title === e.target.innerText
        })[0];

        // Fetch clicked Article edges
        const clickedArticleEdges = [{
            title: 'fdsafds',
            edges: ['fdsafdsa', 'Pfaris, Franfdsaghce'],
            distance: 1,
            path: ['Rijeka, Croatia', 'fdsafds'],
            _id: 'h18f8h1bk32gdsagdsa9r321nf32039'
        }];

        // Last item (path.length - 1) in the path array is the clickedArticle
        // Second (path.length - 2) is the hint
        this.encodeHint(clickedArticle.path[clickedArticle.path.length - 2]);

        // Check winning condition from the fetched object
        const hasWon = true;

        this.setState(() => ({
            currentArticle: clickedArticle,
            currentArticleEdges: clickedArticleEdges,
            hasWon,
            showHint: false
        }));
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
                        <Link to={'/finish'}>
                            <button onClick={() => this.clickSurrender(value)}>Surrender</button>
                        </Link>
                    )}
                </GameSessionContext.Consumer>
            </div>
        )
    }
};

export default ArticlePage;