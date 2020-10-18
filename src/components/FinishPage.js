import React from 'react';
import { Link } from 'react-router-dom';

import GameSessionContext from '../context/GameSessionContext';

class FinishPage extends React.Component {
    static contextType = GameSessionContext;

    state = {
        surrendered: this.context.surrendered
    };

    componentDidMount() {
        console.log(this.context);
    }

    render() {
        return (
            <div>
                <h2>{this.state.surrendered ? 'You surrendered' : 'Congratulations!'}</h2>
                <p>-- Score table --</p>
                <Link to={'/'}>
                    <button>Home</button>
                </Link>
            </div>
        )
    }
};

export default FinishPage;