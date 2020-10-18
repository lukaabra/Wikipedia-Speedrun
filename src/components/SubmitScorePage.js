import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

class SubmitScorePage extends React.Component {

    onSubmit = (e) => {
        e.preventDefault();
        this.submitScore();
    }

    render() {
        return (
            <div>
                <Header />
                <p>Would you like to submit your score?</p>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <input type="text" />
                    <button>Submit score</button>
                </form>
                <Link to={'/finish'}>
                    <button>Skip</button>
                </Link>
            </div>
        )
    }
}

export default SubmitScorePage;