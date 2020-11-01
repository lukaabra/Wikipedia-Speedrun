import React from 'react';
import { Link } from 'react-router-dom'

const Footer = () => (
    <div className="footer">
        <Link to={"/how-it-works"} className="footer__link">How it works?</Link>
        <a href="https://github.com/lukaabra" target="_blank" className="footer__link">Luka Abramovic</a>
    </div>
);

export default Footer;