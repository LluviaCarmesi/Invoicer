import React, { Component } from 'react';
import SETTINGS from '../../AppSettings';
import addCompany from '../../services/AddCompany';
import getCompanies from '../../services/GetCompanies';
import ENUSStrings from '../../strings/ENUSStrings';
import companyFormValidation from '../../utilities/validation/CompanyFormValidation';
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import loadingMessage from '../../utilities/LoadingMessage';

export default class CompanySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            currentType: "",
            currentCompanyID: 0,
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            country: "",
            zip: "",
            isActive: true,
            nameError: "",
            phoneError: "",
            emailError: "",
            addressError: "",
            cityError: "",
            countryError: "",
            zipError: "",
            isLoadingCompanies: true,
            errorCompanies: "",
            loadingMessageCompanies: "Loading Companies",
            isSubmissionAttempted: false,
            wasSubmissionFailure: false,
            wasSubmissionSuccessful: false,
            submissionErrorMessage: "",
            isSuccessFailureMessageClosed: true,
            isSubmissionButtonClicked: false
        };
    }

    async loadCompanies() {
        let firstCompanyInformation = {}; // use this when updating state

        const companiesInformation = await getCompanies();
        const firstCompany = companiesInformation.companies.length > 0 ? companiesInformation.companies[0] : { id: 0 };
        if (!!firstCompany.id) {

        }
        this.setState({
            companies: companiesInformation.companies,
            errorCompanies: companiesInformation.error,
            isLoadingCompanies: false
        });
    }

    componentDidMount() {
        const { type } = this.props;
        this.setState({
            currentType: type
        });
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {
            loadingMessage("loading-companies-container", this.state.loadingMessageCompanies, this.state.loadingMessageCompanies);
            this.loadCompanies();
        }
        else {
            this.setState({
                isLoadingCompanies: false,
            });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }
    render() {
        const submissionItem = {
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            address: this.state.address,
            city: this.state.city,
            country: this.state.country,
            zip: this.state.zip,
            isActive: this.state.isActive
        };

        const changeCompany = (value) => {
            this.setState({
                currentCompanyID: value
            });
        };

        const changeValue = (value, id) => {
            this.setState({
                [id]: value
            });
        };

        const closeSuccessFailureMessage = () => {
            this.setState({
                isSuccessFailureMessageClosed: true
            });
        }

        const validateForm = (isSubmissionAttempted) => {
            const validation = companyFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    nameError: validation.errors.nameError,
                    phoneError: validation.errors.phoneError,
                    emailError: validation.errors.emailError,
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                    isSubmissionAttempted: true
                });
            }
            else {
                this.setState({
                    nameError: validation.errors.nameError,
                    phoneError: validation.errors.phoneError,
                    emailError: validation.errors.emailError,
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                });
            }
            return validation.isValid;
        }

        const submitCompanyOnClick = async (event) => {
            event.preventDefault();
            let isSuccessful = false;
            let errorMessage = "";
            if (validateForm(true)) {
                this.setState({
                    isSubmissionButtonClicked: true,
                    isSuccessFailureMessageClosed: true
                });
                if (!this.state.currentCompanyID) {
                    const companyAddition = await addCompany(submissionItem);
                    isSuccessful = !companyAddition.doesErrorExist;
                    errorMessage = companyAddition.errorMessage;
                }
                else {
                    const companyAddition = await editCompany(submissionItem, 1);
                    isSuccessful = !companyAddition.doesErrorExist;
                    errorMessage = companyAddition.errorMessage;
                }
                this.setState({
                    wasSubmissionSuccessful: isSuccessful,
                    wasSubmissionFailure: !isSuccessful,
                    submissionErrorMessage: errorMessage,
                    isSuccessFailureMessageClosed: false,
                    isSubmissionButtonClicked: false
                });
            }
        };

        return (
            <div className="company-settings-container">
                <React.Fragment>
                    <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                        <span>{this.state.loadingMessageCompanies}</span>
                    </div>
                    <div hidden={!this.state.errorCompanies}>
                        <span>{this.state.errorCompanies}</span>
                    </div>
                    <div className="submission-loading-overlay" hidden={!this.state.isSubmissionButtonClicked}>
                        <span>{ENUSStrings.CompanyIsSubmittedMessage}</span>
                    </div>
                    <div hidden={this.state.isSuccessFailureMessageClosed}>
                        <div className="error-background" hidden={!this.state.wasSubmissionFailure}>
                            <span>{ENUSStrings.CompanySubmissionFailedMessage}</span>
                            <span>{this.state.submissionErrorMessage}</span>
                        </div>
                        <div className="success-background" hidden={!this.state.wasSubmissionSuccessful}>
                            <span>{ENUSStrings.CompanySubmissionSuccessMessage}</span>
                        </div>
                        <button className="remove-button" onClick={closeSuccessFailureMessage}>{ENUSStrings.CloseLabel}</button>
                    </div>
                    {!this.state.isLoadingCompanies && !this.state.errorCompanies &&
                        <form onSubmit={submitCompanyOnClick}>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.NEW}>Create a New Company</h3>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.EDIT}>Edit a Company</h3>
                            <div>
                                {this.state.currentType === SETTINGS.NEW_EDIT_CHOICES.EDIT &&
                                    <div id="company-companies-container" className="field-whole-container">
                                        <div className="field-label-input-container">
                                            <span className="field-label">{ENUSStrings.ChooseCompanyLabel}</span>
                                            <select
                                                id="company-dropdown"
                                                onChange={(control) => changeCompany(control.target.value)}
                                                title={ENUSStrings.ChooseCompanyLabel}
                                                value={this.state.currentCompanyID}
                                            >
                                                {createHTMLOptions(this.state.companies)}
                                            </select>
                                        </div>
                                    </div>
                                }
                                <div id="company-name-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyNameLabel}</span>
                                        <input
                                            id="name"
                                            type="text"
                                            title={ENUSStrings.CompanyNameLabel}
                                            value={this.state.name}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.name = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.nameError || !this.state.isSubmissionAttempted}>{this.state.nameError}</span>
                                </div>
                                <div id="company-phone-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyPhoneLabel}</span>
                                        <input
                                            id="phone"
                                            type="text"
                                            title={ENUSStrings.CompanyPhoneLabel}
                                            value={this.state.phone}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.phone = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.phoneError || !this.state.isSubmissionAttempted}>{this.state.phoneError}</span>
                                </div>
                                <div id="company-email-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label">{ENUSStrings.CompanyEmailLabel}</span>
                                        <input
                                            id="email"
                                            type="text"
                                            title={ENUSStrings.CompanyEmailLabel}
                                            value={this.state.email}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.email = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.emailError || !this.state.isSubmissionAttempted}>{this.state.emailError}</span>
                                </div>
                                <div id="company-address-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyAddressLabel}</span>
                                        <input
                                            id="address"
                                            type="text"
                                            title={ENUSStrings.CompanyAddressLabel}
                                            value={this.state.address}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.address = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.addressError || !this.state.isSubmissionAttempted}>{this.state.addressError}</span>
                                </div>
                                <div id="company-city-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyCityLabel}</span>
                                        <input
                                            id="city"
                                            type="text"
                                            title={ENUSStrings.CompanyCityLabel}
                                            value={this.state.city}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.city = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.cityError || !this.state.isSubmissionAttempted}>{this.state.cityError}</span>
                                </div>
                                <div id="company-country-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyCountryLabel}</span>
                                        <input
                                            id="country"
                                            type="text"
                                            title={ENUSStrings.CompanyCountryLabel}
                                            value={this.state.country}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.country = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.countryError || !this.state.isSubmissionAttempted}>{this.state.countryError}</span>
                                </div>
                                <div id="company-zip-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyZipLabel}</span>
                                        <input
                                            id="zip"
                                            type="text"
                                            title={ENUSStrings.CompanyZipLabel}
                                            value={this.state.zip}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.zip = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.zipError || !this.state.isSubmissionAttempted}>{this.state.zipError}</span>
                                </div>
                                <div id="company-zip-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.IsCompanyActiveLabel}</span>
                                        <input
                                            id="isActive"
                                            type="checkbox"
                                            title={ENUSStrings.IsCompanyActiveLabel}
                                            checked={this.state.isActive}
                                            onChange={(control) => {
                                                changeValue(control.target.checked, control.target.id);
                                                submissionItem.isActive = control.target.checked;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="buttons-container">
                                    <button
                                        className="primary-button"
                                        type="submit"
                                        title={ENUSStrings.SubmitCompanyLabel}
                                    >
                                        {ENUSStrings.SubmitCompanyLabel}
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