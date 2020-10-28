import React from 'react';
import ReactDOM from 'react-dom';

import AppRouter from './routers/AppRouter';

import './styles/styles.css'

const jsx = (
    <div className="container">
        <AppRouter />
    </div>
);

ReactDOM.render(jsx, document.getElementById('app'));