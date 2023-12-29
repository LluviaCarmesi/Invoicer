import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import "./Layout.css"

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        return (
            <div className="layout-container">
                <NavMenu />
                <div className="app">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
