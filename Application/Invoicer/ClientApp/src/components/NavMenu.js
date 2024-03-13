import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import ENUSStrings from '../strings/ENUSStrings';

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
                        <Link to="/">{ENUSStrings.HomeLabel}</Link>
                    </span>
                    <span>
                        <Link to="/settings">{ENUSStrings.SettingsLabel}</Link>
                    </span>
                    <span>
                        <Link target="_blank" to="/api/companies/export-all-companies-customers-transactions">{ENUSStrings.DownloadAllTransactionsLabel}</Link>
                    </span>
                    <span>
                        <Link target="_blank" to="/api/companies/export-sql-query-to-build-db">{ENUSStrings.DownloadSQLQueryLabel}</Link>
                    </span>
                </div>
            </div>
        );
    }
}
