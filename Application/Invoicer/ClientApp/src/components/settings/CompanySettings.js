import React, { Component } from "react";
import addCompany from "../../services/AddCompany";
import getCompanies from "../../services/GetCompanies";
import ENUSStrings from "../../strings/ENUSStrings";
import companyFormValidation from "../../utilities/validation/CompanyFormValidation";
import SETTINGS from "../../AppSettings";
import loadingMessage from "../../utilities/LoadingMessage";
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import editCompany from "../../services/EditCompany";

export default class CompanySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            currentType: "",
            currentCompanyID: 0,
            name: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zip: "",
            nameError: "",
            addressError: "",
            cityError: "",
            stateError: "",
            countryError: "",
            zipError: "",
            isLoadingCompanies: true,
            errorCompanies: "",
            loadingMessageCompanies: ENUSStrings.LoadingCompaniesLabel,
            isSubmissionAttempted: false,
            wasSubmissionFailure: false,
            wasSubmissionSuccessful: false,
            submissionErrorMessage: "",
            isSuccessFailureMessageClosed: true,
            isSubmissionButtonClicked: false
        };
    }

    async loadCompanies() {
        let currentCompanyInformation = {
            id: 0,
            name: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zip: "",
        }
        const companiesInformation = await getCompanies();
        if (companiesInformation.doesErrorExist) {
            this.setState({
                errorCompanies: companiesInformation.errorMessage,
                isLoadingCompanies: false
            });
            return;
        }
        const currentCompany = companiesInformation.companies.length > 0 ? companiesInformation.companies[0] : { id: 0 };
        if (!!currentCompany.id) {
            currentCompanyInformation.id = currentCompany.id;
            currentCompanyInformation.name = currentCompany.name;
            currentCompanyInformation.address = currentCompany.address;
            currentCompanyInformation.city = currentCompany.city;
            currentCompanyInformation.state = currentCompany.state;
            currentCompanyInformation.country = currentCompany.country;
            currentCompanyInformation.zip = currentCompany.zip;
            currentCompanyInformation.isActive = currentCompany.isActive;
        }
        this.setState({
            currentCompanyID: currentCompanyInformation.id,
            companies: companiesInformation.companies,
            name: currentCompanyInformation.name,
            address: currentCompanyInformation.address,
            city: currentCompanyInformation.city,
            state: currentCompanyInformation.state,
            country: currentCompanyInformation.country,
            zip: currentCompanyInformation.zip,
            isActive: currentCompanyInformation.isActive,
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
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            zip: this.state.zip
        };

        const changeCompany = (value) => {
            const valueToInt = parseInt(value);
            const company = this.state.companies.filter((company) => company.id === valueToInt)[0];
            this.setState({
                currentCompanyID: valueToInt,
                name: company.name,
                address: company.address,
                city: company.city,
                state: company.state,
                country: company.country,
                zip: company.zip
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
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    stateError: validation.errors.stateError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                    isSubmissionAttempted: true
                });
            }
            else {
                this.setState({
                    nameError: validation.errors.nameError,
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    stateError: validation.errors.stateError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                });
            }
            return validation.isValid;
        }

        const submitCompanyOnClick = async (event) => {
            event.preventDefault();
            let currentInformation = submissionItem;
            let isSuccessful = false;
            let errorMessage = "";
            if (validateForm(true)) {
                this.setState({
                    isSubmissionButtonClicked: true,
                    isSuccessFailureMessageClosed: true
                });
                if (!this.state.currentCompanyID) {
                    const companyAddition = await addCompany(currentInformation);
                    isSuccessful = !companyAddition.doesErrorExist;
                    errorMessage = companyAddition.errorMessage;
                    if (isSuccessful) {
                        currentInformation.name = "";
                        currentInformation.address = "";
                        currentInformation.city = "";
                        currentInformation.state = "";
                        currentInformation.country = "";
                        currentInformation.zip = "";
                    }
                }
                else {
                    const companyEdit= await editCompany(currentInformation, this.state.currentCompanyID);
                    isSuccessful = !companyEdit.doesErrorExist;
                    errorMessage = companyEdit.errorMessage;
                }
                this.setState({
                    name: currentInformation.name,
                    address: currentInformation.address,
                    city: currentInformation.city,
                    state: currentInformation.state,
                    country: currentInformation.country,
                    zip: currentInformation.zip,
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
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.NEW}>{ENUSStrings.CreateNewCompanyLabel}</h3>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.EDIT}>{ENUSStrings.EditCompanyLabel}</h3>
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

                                <div id="company-state-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyStateLabel}</span>
                                        <input
                                            id="state"
                                            type="text"
                                            title={ENUSStrings.CompanyStateLabel}
                                            value={this.state.state}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.state = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.stateError || !this.state.isSubmissionAttempted}>{this.state.stateError}</span>
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