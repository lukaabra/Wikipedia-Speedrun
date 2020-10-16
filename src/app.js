import React from 'react';
import ReactDOM from 'react-dom';

import HomePage from './components/HomePage';
import AppRouter from './routers/AppRouter';

const jsx = (
    <div>
        <AppRouter />
    </div>
);

ReactDOM.render(jsx, document.getElementById('app'));