import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from '../components/HomePage';
import InstructionPage from '../components/InstructionPage';
import NotFoundPage from '../components/NotFoundPage';

const AppRouter = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" component={HomePage} exact={true} />
            <Route path="/instructions" component={InstructionPage} exact={true} />
            <Route component={NotFoundPage} />
        </Switch>
    </BrowserRouter>
);

export default AppRouter;