import React from 'react';
import Header from './Header';

class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.history.push('/');
        }, 5000);
    };

    render() {
        return (
            <div>
                <Header />
                <div>
                    <p className="header__subtitle">Oops! There was an error! Sorry for the inconvenience. You will be redirected to the home page soon.</p>
                    <button className="button">Home</button>
                </div>
            </div>
        )
    }
};

export default ErrorPage;