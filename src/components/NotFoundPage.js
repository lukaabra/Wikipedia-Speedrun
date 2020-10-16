import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div>
        <p>The page you are trying to access does not exist.</p>
        <Link to={'/'}>Home</Link>
    </div>
);

export default NotFoundPage;