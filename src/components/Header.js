import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => (
    <div className="header">
        <NavLink to={"/"} className="header__title">
            <h1>Wikipedia Speedrun</h1>
        </NavLink>

        {props.subtitle && <h3 className="header__subtitle">{props.subtitle}</h3>}
    </div>
);

export default Header;