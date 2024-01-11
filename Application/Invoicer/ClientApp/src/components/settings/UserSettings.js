import React, { Component } from "react";
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import userFormValidation from "../../utilities/validation/UserFormValidation";
import getUsers from "../../services/GetUsers";
import loadingMessage from "../../utilities/LoadingMessage";

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
            userPhone: "",
            username: "",
            password: "",
            confirmPassword: "",
            firstNameError: "",
            lastNameError: "",
            userEmailError: "",
            userPhoneError: "",
            usernameError: "",
            passwordError: "",
            confirmPasswordError: "",
            loadingMessageUsers: "Loading Users",
            isSubmissionAttempted: false
        }
    }

    async loadUsers() {
        let firstUserInformation = {}; // use this when updating state

        const usersInformation = await getUsers();
        const firstUser = usersInformation.users.length > 0 ? usersInformation.users[0] : { id: 0 };
        if (!!firstUser.id) {

        }
        this.setState({
            users: usersInformation.users,
            errorUsers: usersInformation.error,
            isLoadingUsers: false
        });
    }

    componentDidMount() {
        const { type } = this.props;
        this.setState({
            currentType: type
        });
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {
            loadingMessage("loading-users-container", this.state.loadingMessageUsers, this.state.loadingMessageUsers);
            this.loadUsers();
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
            userPhone: this.state.userPhone,
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
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
            const validation = userFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    firstNameError: validation.errors.firstNameError,
                    lastNameError: validation.errors.lastNameError,
                    userEmailError: validation.errors.userEmailError,
                    userPhoneError: validation.errors.userPhoneError,
                    usernameError: validation.errors.usernameError,
                    passwordError: validation.errors.passwordError,
                    confirmPasswordError: validation.errors.confirmPasswordError,
                    isSubmissionAttempted: true
                });
            }
            else {
                this.setState({
                    firstNameError: validation.errors.firstNameError,
                    lastNameError: validation.errors.lastNameError,
                    userEmailError: validation.errors.userEmailError,
                    userPhoneError: validation.errors.userPhoneError,
                    usernameError: validation.errors.usernameError,
                    passwordError: validation.errors.passwordError,
                    confirmPasswordError: validation.errors.confirmPasswordError
                });
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
                        <span>{this.state.loadingMessageUsers}</span>
                    </div>
                    <div hidden={!this.state.errorUsers}>
                        <span>{this.state.errorUsers}</span>
                    </div>
                    {!this.state.isLoadingUsers && !this.state.errorUsers &&
                        <form onSubmit={createUserOnClick}>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.NEW}>Create a New User</h3>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.EDIT}>Edit a User</h3>
                            <div>
                                {this.state.currentType === SETTINGS.NEW_EDIT_CHOICES.EDIT &&
                                    <div id="user-users-container" className="field-whole-container">
                                        <div className="field-label-input-container">
                                            <span className="field-label">{ENUSStrings.ChooseUserLabel}</span>
                                            <select
                                                id="user-dropdown"
                                                onChange={(control) => changeUser(control.target.value)}
                                                title={ENUSStrings.ChooseUserLabel}
                                                value={this.state.currentUserID}
                                            >
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
                                            title={ENUSStrings.FirstNameLabel}
                                            value={this.state.firstName}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.firstName = control.target.value;
                                                validateForm();
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
                                            title={ENUSStrings.LastNameLabel}
                                            value={this.state.lastName}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.lastName = control.target.value;
                                                validateForm();
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
                                            title={ENUSStrings.UserEmailLabel}
                                            value={this.state.userEmail}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.userEmail = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.userEmailError || !this.state.isSubmissionAttempted}>{this.state.userEmailError}</span>
                                </div>
                                <div id="user-email-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.UserPhoneLabel}</span>
                                        <input
                                            id="userPhone"
                                            type="text"
                                            title={ENUSStrings.UserPhoneLabel}
                                            value={this.state.userPhone}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.userPhone = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.userPhoneError || !this.state.isSubmissionAttempted}>{this.state.userPhoneError}</span>
                                </div>
                                <div id="user-username-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.UsernameLabel}</span>
                                        <input
                                            id="username"
                                            type="text"
                                            title={ENUSStrings.UsernameLabel}
                                            value={this.state.username}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.username = control.target.value;
                                                validateForm();
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
                                            type="password"
                                            title={ENUSStrings.PasswordLabel}
                                            value={this.state.password}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.password = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.passwordError || !this.state.isSubmissionAttempted}>{this.state.passwordError}</span>
                                </div>
                                <div id="user-password-confirm-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.ConfirmPasswordLabel}</span>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            title={ENUSStrings.ConfirmPasswordLabel}
                                            value={this.state.confirmPassword}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.confirmPassword = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.confirmPasswordError || !this.state.isSubmissionAttempted}>{this.state.confirmPasswordError}</span>
                                </div>
                                <div className="buttons-container">
                                    <button
                                        className="primary-button"
                                        type="submit"
                                        title={ENUSStrings.SubmitUserLabel}
                                    >
                                        {ENUSStrings.SubmitUserLabel}
                                    </button>
                                </div>
                            </div>
                        </form>
                    }
                </React.Fragment>
            </div>
        );
    }
}