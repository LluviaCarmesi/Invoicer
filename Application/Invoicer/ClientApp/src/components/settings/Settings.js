import React, { Component } from 'react';
import SETTINGS from '../../AppSettings';
import checkQueryParameter from '../../utilities/CheckQueryParameter';
import CompanySettings from './CompanySettings';
import "./Settings.css";
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSetting: ""
        };
    }

    componentDidMount() {
        const type = checkQueryParameter(SETTINGS.TYPE_QUERY_PARAMETER);
        this.setState({
            currentSetting: type
        });
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }
    render() {

        return (
            <div className="settings-container">
                <div className="settings-menu">
                    <h3>Companies</h3>
                    <span>
                        <a href="/settings?type=editCompanies">Edit Companies</a>
                    </span>
                    <span>
                        <a href="/settings?type=addCompany">Add a Company</a>
                    </span>
                    <h3>Accounts</h3>
                    <span>
                        <a href="/settings?type=editAccounts">Edit Accounts</a>
                    </span>
                    <span>
                        <a href="/settings?type=addAccount">Add an Account</a>
                    </span>
                </div>
                <div className="settings-app">
                    {
                        this.state.currentSetting === "editCompanies" &&
                        <CompanySettings type="edit"/>
                    }
                    {
                        this.state.currentSetting === "addCompany" &&
                        <CompanySettings type="new"/>
                    }
                </div>
            </div>
        );
    }
}