import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div>
                <header id="header">
                    <ul>
                        <li className="header-left">
                        <em className="logo"><img src="/logo.png" alt="Not found" /></em>
                        <a href = "" className="text-logo">
                            <em className="text-logo-1">DHL</em>
                            <em className="text-logo-2">LOCATION</em>
                            <em className="text-logo-3">TRACKER</em>
                        </a>
                        </li>
                        <li className="header-right">
                            <a className="nav-btn">CONTACT US</a>
                        </li>
                    </ul>
                    <div className="phone-tablet">
                        <a className="pandt"><i className="fa-solid fa-box-open" /></a>
                        <a className="pandt"><i className="fa-solid fa-bars" /></a>
                    </div>
                </header>
            </div>
        );
    }
}

export default Header;