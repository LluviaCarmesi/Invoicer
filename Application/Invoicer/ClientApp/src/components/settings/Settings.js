import React, { Component } from 'react';
import SETTINGS from '../../AppSettings';
import checkQueryParameter from '../../utilities/CheckQueryParameter';
import CompanySettings from './CompanySettings';
import "./Settings.css";
import UserSettings from './UserSettings';
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
                        <a href={"/settings?type=" + SETTINGS.APPLICATION_SETTINGS_MENUS.ADD_COMPANY}>Add a Company</a>
                    </span>
                    <span>
                        <a href={"/settings?type=" + SETTINGS.APPLICATION_SETTINGS_MENUS.EDIT_COMPANIES}>Edit Companies</a>
                    </span>
                    <h3>Accounts</h3>
                    <span>
                        <a href={"/settings?type=" + SETTINGS.APPLICATION_SETTINGS_MENUS.ADD_USER}>Add an Account</a>
                    </span>
                    <span>
                        <a href={"/settings?type=" + SETTINGS.APPLICATION_SETTINGS_MENUS.EDIT_USERS}>Edit Accounts</a>
                    </span>
                </div>
                <div className="settings-app">
                    {
                        this.state.currentSetting === SETTINGS.APPLICATION_SETTINGS_MENUS.ADD_COMPANY &&
                        <CompanySettings type={SETTINGS.NEW_EDIT_CHOICES.NEW} />
                    }
                    {
                        this.state.currentSetting === SETTINGS.APPLICATION_SETTINGS_MENUS.EDIT_COMPANIES &&
                        <CompanySettings type={SETTINGS.NEW_EDIT_CHOICES.EDIT} />
                    }
                    {
                        this.state.currentSetting === SETTINGS.APPLICATION_SETTINGS_MENUS.ADD_USER &&
                        <UserSettings type={SETTINGS.NEW_EDIT_CHOICES.NEW} />
                    }
                    {
                        this.state.currentSetting === SETTINGS.APPLICATION_SETTINGS_MENUS.EDIT_USERS &&
                        <UserSettings type={SETTINGS.NEW_EDIT_CHOICES.EDIT} />
                    }
                </div>
            </div>
        );
    }
}