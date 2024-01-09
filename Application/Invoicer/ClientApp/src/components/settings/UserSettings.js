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
            userEmail: "",
            username: "",
            password: "",
            firstNameError: "",
            lastNameError: "",
            userEmailError: "",
            usernameError: "",
            passwordError: "",
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
            userEmail: this.state.userEmail,
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

        const validateForm = (isSubmissionAttempted) => {
            const validation = null; //Need to implement validation function
            if (isSubmissionAttempted) {

            }
            else {

            }
        }

        const createUserOnClick = (event) => {
            event.preventDefault();
            if (validateForm(true)) {

            }
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
                                            <span className="field-label">{ENUSStrings.ChooseUserLabel}</span>
                                            <select id="user-dropdown" onChange={(control) => changeUser(control.target.value)} value={this.state.currentUserID}>
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
                                    <span className="field-error" hidden={!this.state.firstNameError || !this.state.isSubmissionAttempted}>{this.state.firstNameError}</span>
                                </div>
                                <div id="user-last-name-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.LastNameLabel}</span>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={this.state.lastName}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyName = control.target.value;
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.lastNameError || !this.state.isSubmissionAttempted}>{this.state.lastNameError}</span>
                                </div>
                                <div id="user-email-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.UserEmailLabel}</span>
                                        <input
                                            id="userEmail"
                                            type="text"
                                            value={this.state.userEmail}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyName = control.target.value;
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.userEmailError || !this.state.isSubmissionAttempted}>{this.state.userEmailError}</span>
                                </div>
                                <div id="user-username-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.UsernameLabel}</span>
                                        <input
                                            id="username"
                                            type="text"
                                            value={this.state.username}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyName = control.target.value;
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.usernameError || !this.state.isSubmissionAttempted}>{this.state.usernameError}</span>
                                </div>
                                <div id="user-password-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.PasswordLabel}</span>
                                        <input
                                            id="password"
                                            type="text"
                                            value={this.state.password}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyName = control.target.value;
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.passwordError || !this.state.isSubmissionAttempted}>{this.state.passwordError}</span>
                                </div>
                                <div className="buttons-container">
                                    <button className="primary-button" type="submit">{ENUSStrings.SubmitUserLabel}</button>
                                </div>
                            </div>
                        </form>
                    }
                </React.Fragment>
            </div>
        );
    }
}