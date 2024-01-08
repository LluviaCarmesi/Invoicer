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
            companyName: "",
            companyPhone: "",
            companyEmail: "",
            companyAddress: "",
            companyCity: "",
            companyCountry: "",
            companyZip: "",
            isCompanyAccountActive: true,
            companyNameError: "",
            companyPhoneError: "",
            companyEmailError: "",
            companyAddressError: "",
            companyCityError: "",
            companyCountryError: "",
            companyZipError: "",
            isSubmissionAttempted: false,
            isLoadingCompanies: true,
            errorCompanies: "",
            loadingMessageCompanies: "Loading Companies",
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
            companyName: this.state.companyName,
            companyPhone: this.state.companyPhone,
            companyEmail: this.state.companyEmail,
            companyAddress: this.state.companyAddress,
            companyCity: this.state.companyCity,
            companyCountry: this.state.companyCountry,
            companyZip: this.state.companyZip,
            isCompanyAccountActive: this.state.isCompanyAccountActive
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

        const validateForm = (isSubmissionAttempted) => {
            const validation = companyFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    companyNameError: validation.errors.companyNameError,
                    companyPhoneError: validation.errors.companyPhoneError,
                    companyEmailError: validation.errors.companyEmailError,
                    companyAddressError: validation.errors.companyAddressError,
                    companyCityError: validation.errors.companyCityError,
                    companyCountryError: validation.errors.companyCountryError,
                    companyZipError: validation.errors.companyZipError,
                    isSubmissionAttempted: true
                });
            }
            else {
                this.setState({
                    companyNameError: validation.errors.companyNameError,
                    companyPhoneError: validation.errors.companyPhoneError,
                    companyEmailError: validation.errors.companyEmailError,
                    companyAddressError: validation.errors.companyAddressError,
                    companyCityError: validation.errors.companyCityError,
                    companyCountryError: validation.errors.companyCountryError,
                    companyZipError: validation.errors.companyZipError,
                });
            }
            return validation.isValid;
        }

        const createCompanyOnClick = (event) => {
            event.preventDefault();
            if (validateForm(true)) {
                addCompany({
                    name: this.state.companyName,
                    phone: this.state.companyPhone,
                    email: this.state.companyEmail,

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
                    {!this.state.isLoadingCompanies && !this.state.errorCompanies &&
                        <form onSubmit={createCompanyOnClick}>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.NEW}>Create a New Company</h3>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.EDIT}>Edit a Company</h3>
                            <div>
                                {this.state.currentType === SETTINGS.NEW_EDIT_CHOICES.EDIT &&
                                    <div id="company-companies-container" className="field-whole-container">
                                        <div className="field-label-input-container">
                                            <span className="field-label">{ENUSStrings.ChooseCompanyLabel}</span>
                                            <select id="company-dropdown" onChange={(control) => changeCompany(control.target.value)} value={this.state.currentCompanyID}>
                                                {createHTMLOptions(this.state.companies)}
                                            </select>
                                        </div>
                                    </div>
                                }
                                <div id="company-name-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyNameLabel}</span>
                                        <input
                                            id="companyName"
                                            type="text"
                                            value={this.state.companyName}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyName = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyNameError || !this.state.isSubmissionAttempted}>{this.state.companyNameError}</span>
                                </div>
                                <div id="company-phone-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyPhoneLabel}</span>
                                        <input
                                            id="companyPhone"
                                            type="text"
                                            value={this.state.companyPhone}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyPhone = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyPhoneError || !this.state.isSubmissionAttempted}>{this.state.companyPhoneError}</span>
                                </div>
                                <div id="company-email-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label">{ENUSStrings.CompanyEmailLabel}</span>
                                        <input
                                            id="companyEmail"
                                            type="text"
                                            value={this.state.companyEmail}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyEmail = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyEmailError || !this.state.isSubmissionAttempted}>{this.state.companyEmailError}</span>
                                </div>
                                <div id="company-address-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyAddressLabel}</span>
                                        <input
                                            id="companyAddress"
                                            type="text"
                                            value={this.state.companyAddress}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyAddress = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyAddressError || !this.state.isSubmissionAttempted}>{this.state.companyAddressError}</span>
                                </div>
                                <div id="company-city-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyCityLabel}</span>
                                        <input
                                            id="companyCity"
                                            type="text"
                                            value={this.state.companyCity}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyCity = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyCityError || !this.state.isSubmissionAttempted}>{this.state.companyCityError}</span>
                                </div>
                                <div id="company-country-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyCountryLabel}</span>
                                        <input
                                            id="companyCountry"
                                            type="text"
                                            value={this.state.companyCountry}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyCountry = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyCountryError || !this.state.isSubmissionAttempted}>{this.state.companyCountryError}</span>
                                </div>
                                <div id="company-zip-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyZipLabel}</span>
                                        <input
                                            id="companyZip"
                                            type="text"
                                            value={this.state.companyZip}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.companyZip = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.companyZipError || !this.state.isSubmissionAttempted}>{this.state.companyZipError}</span>
                                </div>
                                <div id="company-zip-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.IsCompanyActiveLabel}</span>
                                        <input
                                            id="isCompanyAccountActive"
                                            type="checkbox"
                                            checked={this.state.companyAccountActive}
                                            onChange={(control) => {
                                                changeValue(control.target.checked, control.target.id);
                                                submissionItem.isCompanyAccountActive = control.target.checked;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="buttons-container">
                                    <button className="primary-button" type="submit">Create Company</button>
                                </div>
                            </div>
                        </form>
                    }
                </React.Fragment>
            </div>
        );
    }
}