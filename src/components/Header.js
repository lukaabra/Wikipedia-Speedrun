import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
    <NavLink to={"/"}>
        <h1>Wikipedia Speedrun</h1>
    </NavLink>
);

export default Header;