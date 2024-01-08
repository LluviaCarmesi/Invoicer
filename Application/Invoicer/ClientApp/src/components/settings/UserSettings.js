import React, { Component } from "react";
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";

export default class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentType: "",
            users: [],
            errorUsers: "",
            isLoadingUsers: true,
            currentUserID: 0,
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            loadingUsersMessage: "Loading Users"
        }
    }

    componentDidMount() {
        const { type } = this.props;
        this.setState({
            currentType: type
        });
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {

        }
        else {
            this.setState({
                isLoadingUsers: false
            })
        }
    }

    render() {
        const submissionItem = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        }

        const changeUser = (value) => {
            this.setState({
                currentUserID: value
            });
        };

        const changeValue = (value, id) => {
            this.setState({
                [id]: value
            });
        };

        return (
            <div className="user-settings-container">
                <React.Fragment>
                    <div id="loading-users-container" hidden={!this.state.isLoadingUsers}>
                        <span>{this.state.loadingUsersMessage}</span>
                    </div>
                    <div hidden={!this.state.errorUsers}>
                        <span>{this.state.errorUsers}</span>
                    </div>
                    {!this.state.isLoadingUsers && !this.state.errorUsers &&
                        <form onSubmit={null}>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.NEW}>Create a New User</h3>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.EDIT}>Edit a User</h3>
                            <div>
                                {this.state.currentType === SETTINGS.NEW_EDIT_CHOICES.EDIT &&
                                    <div id="user-users-container" className="field-whole-container">
                                        <div className="field-label-input-container">
                                            <span className="field-label">{ENUSStrings.ChooseCompanyLabel}</span>
                                            <select id="user-dropdown" onChange={(control) => changeUser(control.target.value)} value={this.state.currentCompanyID}>
                                                {createHTMLOptions(this.state.users)}
                                            </select>
                                        </div>
                                    </div>
                                }
                                <div id="user-first-name-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.FirstNameLabel}</span>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={this.state.firstName}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyName = control.target.value;
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyNameError || !this.state.isSubmissionAttempted}>{this.state.companyNameError}</span>
                                </div>
                            </div>
                        </form>
                    }
                </React.Fragment>
            </div>
        );
    }
}