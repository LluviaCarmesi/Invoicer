import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <div className="links-header">
                <div className="links-container">
                    <span>
                        <Link to="/">Home</Link>
                    </span>
                    <span>
                        <Link to="/settings">Settings</Link>
                    </span>
                </div>
            </div>
        );
    }
}
