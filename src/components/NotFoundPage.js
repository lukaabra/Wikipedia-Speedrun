import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div>
        <p className="header__subtitle">The page you are trying to access does not exist.</p>
        <Link to={'/'} className="button">Home</Link>
    </div>
);

export default NotFoundPage;