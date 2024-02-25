import React, { Component } from 'react';
import SETTINGS from '../../AppSettings';
import addCustomer from '../../services/AddCustomer';
import getCustomers from '../../services/GetCustomers';
import ENUSStrings from '../../strings/ENUSStrings';
import customerFormValidation from '../../utilities/validation/CustomerFormValidation';
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import loadingMessage from '../../utilities/LoadingMessage';
import editCustomer from "../../services/EditCustomer";
import getCompanies from "../../services/GetCompanies";
import getCookie from "../../utilities/GetCookie";
import setCookie from "../../utilities/SetCookie";

export default class CustomerSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            customers: [],
            currentType: "",
            currentCompanyID: 0,
            currentCustomerID: 0,
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zip: "",
            isActive: true,
            companyIDError: "",
            nameError: "",
            phoneError: "",
            emailError: "",
            addressError: "",
            cityError: "",
            stateError: "",
            countryError: "",
            zipError: "",
            isLoadingCompanies: true,
            isLoadingCustomers: true,
            errorCompanies: "",
            errorCustomers: "",
            loadingCompaniesMessage: ENUSStrings.LoadingCompaniesLabel,
            loadingCustomersMessage: ENUSStrings.LoadingCustomersLabel,
            isSubmissionAttempted: false,
            wasSubmissionFailure: false,
            wasSubmissionSuccessful: false,
            submissionErrorMessage: "",
            isSuccessFailureMessageClosed: true,
            isSubmissionButtonClicked: false
        };
    }

    async loadCompanies(type) {
        const companiesInformation = await getCompanies();
        if (companiesInformation.doesErrorExist) {
            this.setState({
                errorCompanies: companiesInformation.errorMessage,
                isLoadingCompanies: false,
                isLoadingCustomers: false
            });
            return;
        }
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {
            this.setState({
                companies: companiesInformation.companies,
                isLoadingCompanies: false,
            });
        }
        else {
            this.setState({
                companies: companiesInformation.companies,
                currentCompanyID: companiesInformation.companies[0].id,
                isLoadingCompanies: false,
            });
        }
    }

    async loadCustomers() {
        let currentCustomerInformation = {
            id: 0,
            companyID: 0,
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zip: "",
            isActive: true
        };

        const customersInformation = await getCustomers();
        if (customersInformation.doesErrorExist) {
            this.setState({
                errorCustomers: customersInformation.errorMessage,
                isLoadingCustomers: false
            });
            return;
        }
        const customersReturned = customersInformation.customers;
        const currentCustomerCookie = getCookie(SETTINGS.COOKIE_KEYS.CHOSEN_CUSTOMER);
        const filteredCustomerWithCookie = !!currentCustomerCookie ?
            customersReturned.filter(customer => customer.id === parseInt(currentCustomerCookie)) : [];
        const currentCustomer = filteredCustomerWithCookie.length === 1 ? filteredCustomerWithCookie[0] : customersReturned[0];
        console.log(currentCustomer);
        currentCustomerInformation.id = currentCustomer.id;
        currentCustomerInformation.companyID = currentCustomer.companyID;
        currentCustomerInformation.name = currentCustomer.name;
        currentCustomerInformation.phone = currentCustomer.phone;
        currentCustomerInformation.email = currentCustomer.email;
        currentCustomerInformation.address = currentCustomer.address;
        currentCustomerInformation.city = currentCustomer.city;
        currentCustomerInformation.state = currentCustomer.state;
        currentCustomerInformation.country = currentCustomer.country;
        currentCustomerInformation.zip = currentCustomer.zip;
        currentCustomerInformation.isActive = currentCustomer.isActive;
        this.setState({
            currentCustomerID: currentCustomerInformation.id,
            currentCompanyID: currentCustomerInformation.companyID,
            customers: customersInformation.customers,
            name: currentCustomerInformation.name,
            phone: currentCustomerInformation.phone,
            email: currentCustomerInformation.email,
            address: currentCustomerInformation.address,
            city: currentCustomerInformation.city,
            state: currentCustomerInformation.state,
            country: currentCustomerInformation.country,
            zip: currentCustomerInformation.zip,
            isActive: currentCustomerInformation.isActive,
            isLoadingCustomers: false
        });
    }

    componentDidMount() {
        const { type } = this.props;
        this.setState({
            currentType: type
        });
        this.loadCompanies(type);
        loadingMessage("loading-companies-container", this.state.loadingCompaniesMessage, this.state.loadingCompaniesMessage);
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {
            loadingMessage("loading-customers-container", this.state.loadingCustomersMessage, this.state.loadingCustomersMessage);
            this.loadCustomers();
        }
        else {
            this.setState({
                isLoadingCustomers: false
            });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }
    render() {
        const submissionItem = {
            companyID: this.state.currentCompanyID,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            zip: this.state.zip,
            isActive: this.state.isActive
        };

        const changeCustomer = (value) => {
            const valueToInt = parseInt(value);
            setCookie(SETTINGS.COOKIE_KEYS.CHOSEN_CUSTOMER, valueToInt);
            const customer = this.state.customers.filter((customer) => customer.id === valueToInt)[0];
            this.setState({
                currentCustomerID: valueToInt,
                currentCompanyID: customer.companyID,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                city: customer.city,
                state: customer.state,
                country: customer.country,
                zip: customer.zip,
                isActive: customer.isActive
            });
        };

        const changeCompany = (value) => {
            const valueToInt = parseInt(value);
            this.setState({
                currentCompanyID: parseInt(valueToInt)
            });
        }

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
            const validation = customerFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    companyIDError: validation.errors.companyIDError,
                    nameError: validation.errors.nameError,
                    phoneError: validation.errors.phoneError,
                    emailError: validation.errors.emailError,
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
                    companyIDError: validation.errors.companyIDError,
                    nameError: validation.errors.nameError,
                    phoneError: validation.errors.phoneError,
                    emailError: validation.errors.emailError,
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    stateError: validation.errors.stateError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                });
            }
            return validation.isValid;
        }

        const submitCustomerOnClick = async (event) => {
            event.preventDefault();
            let currentInformation = submissionItem;
            let isSuccessful = false;
            let errorMessage = "";
            let currentCustomers = [];
            if (validateForm(true)) {
                this.setState({
                    isSubmissionButtonClicked: true,
                    isSuccessFailureMessageClosed: true
                });
                if (!this.state.currentCustomerID) {
                    const customerAddition = await addCustomer(currentInformation);
                    isSuccessful = !customerAddition.doesErrorExist;
                    errorMessage = customerAddition.errorMessage;
                }
                else {
                    const customerEdit = await editCustomer(currentInformation, this.state.currentCustomerID);
                    isSuccessful = !customerEdit.doesErrorExist;
                    errorMessage = customerEdit.errorMessage;
                }
                if (isSuccessful) {
                    const allCustomersCookie = getCookie(SETTINGS.COOKIE_KEYS.ALL_CUSTOMERS);
                    if (!!allCustomersCookie) {
                        let allCustomers = JSON.parse(allCustomersCookie);
                        allCustomers = allCustomers.filter(customer => customer.id !== this.state.currentCustomerID);
                        currentInformation.id = this.state.currentCustomerID;
                        allCustomers.push(currentInformation);
                        setCookie(SETTINGS.COOKIE_KEYS.ALL_CUSTOMERS, JSON.stringify(allCustomers), 1);
                    }
                    if (!this.state.currentCustomerID) {
                        currentInformation.name = "";
                        currentInformation.phone = "";
                        currentInformation.email = "";
                        currentInformation.address = "";
                        currentInformation.city = "";
                        currentInformation.state = "";
                        currentInformation.country = "";
                        currentInformation.zip = "";
                        currentInformation.isActive = true;
                    }
                    currentCustomers = !this.state.currentCustomerID ? await getCustomers(true) : await getCustomers();
                    if (currentCustomers.doesErrorExist) {
                        isSuccessful = false;
                        errorMessage = currentCustomers.errorMessage;
                    }
                }
                console.log(currentCustomers);
                this.setState({
                    customers: currentCustomers.customers,
                    currentCompanyID: currentInformation.companyID,
                    name: currentInformation.name,
                    phone: currentInformation.phone,
                    email: currentInformation.email,
                    address: currentInformation.address,
                    city: currentInformation.city,
                    state: currentInformation.state,
                    country: currentInformation.country,
                    zip: currentInformation.zip,
                    isActive: currentInformation.isActive,
                    isSubmissionAttempted: !isSuccessful,
                    wasSubmissionSuccessful: isSuccessful,
                    wasSubmissionFailure: !isSuccessful,
                    submissionErrorMessage: errorMessage,
                    isSuccessFailureMessageClosed: false,
                    isSubmissionButtonClicked: false
                });
            }
        };

        return (
            <div className="customer-settings-container">
                <React.Fragment>
                    <div id="loading-customers-container" hidden={!this.state.isLoadingCustomers}>
                        <span>{this.state.loadingCustomersMessage}</span>
                    </div>
                    <div hidden={!this.state.errorCustomers}>
                        <span>{this.state.errorCustomers}</span>
                    </div>
                    <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                        <span>{this.state.loadingCompaniesMessage}</span>
                    </div>
                    <div hidden={!this.state.errorCompanies}>
                        <span>{this.state.errorCompanies}</span>
                    </div>
                    <div className="submission-loading-overlay" hidden={!this.state.isSubmissionButtonClicked}>
                        <span>{ENUSStrings.CustomerIsSubmittedMessage}</span>
                    </div>
                    <div hidden={this.state.isSuccessFailureMessageClosed}>
                        <div className="error-background" hidden={!this.state.wasSubmissionFailure}>
                            <span>{ENUSStrings.CustomerSubmissionFailedMessage}</span>
                            <span>{this.state.submissionErrorMessage}</span>
                        </div>
                        <div className="success-background" hidden={!this.state.wasSubmissionSuccessful}>
                            <span>{ENUSStrings.CustomerSubmissionSuccessMessage}</span>
                        </div>
                        <button className="remove-button" onClick={closeSuccessFailureMessage}>{ENUSStrings.CloseLabel}</button>
                    </div>
                    {!this.state.isLoadingCustomers && !this.state.errorCustomers && !this.state.isLoadingCompanies && !this.state.errorCompanies &&
                        <form onSubmit={submitCustomerOnClick}>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.NEW}>Create a New Customer</h3>
                            <h3 hidden={this.state.currentType !== SETTINGS.NEW_EDIT_CHOICES.EDIT}>Edit a Customer</h3>
                            <div>
                                {this.state.currentType === SETTINGS.NEW_EDIT_CHOICES.EDIT &&
                                    <div id="customer-customers-container" className="field-whole-container">
                                        <div className="field-label-input-container">
                                            <span className="field-label">{ENUSStrings.ChooseCustomerLabel}</span>
                                            <select
                                                id="customer-dropdown"
                                                onChange={(control) => changeCustomer(control.target.value)}
                                                title={ENUSStrings.ChooseCustomerLabel}
                                                value={this.state.currentCustomerID}
                                            >
                                                {createHTMLOptions(this.state.customers)}
                                            </select>
                                        </div>
                                    </div>
                                }
                                <div id="company-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CompanyNameLabel}</span>
                                        <select
                                            id="company-dropdown"
                                            onChange={(control) => changeCompany(control.target.value)}
                                            title={ENUSStrings.ChooseCompanyLabel}
                                            value={this.state.currentCompanyID}
                                        >
                                            {createHTMLOptions(this.state.companies, "city")}
                                        </select>
                                    </div>
                                    <span className="field-error" hidden={!this.state.nameError || !this.state.isSubmissionAttempted}>{this.state.nameError}</span>
                                </div>
                                <div id="customer-name-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerNameLabel}</span>
                                        <input
                                            id="name"
                                            type="text"
                                            title={ENUSStrings.CustomerNameLabel}
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
                                <div id="customer-phone-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerPhoneLabel}</span>
                                        <input
                                            id="phone"
                                            type="text"
                                            title={ENUSStrings.CustomerPhoneLabel}
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
                                <div id="customer-email-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerEmailLabel}</span>
                                        <input
                                            id="email"
                                            type="text"
                                            title={ENUSStrings.CustomerEmailLabel}
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
                                <div id="customer-address-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerAddressLabel}</span>
                                        <input
                                            id="address"
                                            type="text"
                                            title={ENUSStrings.CustomerAddressLabel}
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
                                <div id="customer-city-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerCityLabel}</span>
                                        <input
                                            id="city"
                                            type="text"
                                            title={ENUSStrings.CustomerCityLabel}
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
                                <div id="customer-state-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerStateLabel}</span>
                                        <input
                                            id="state"
                                            type="text"
                                            title={ENUSStrings.CustomerStateLabel}
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
                                <div id="customer-country-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerCountryLabel}</span>
                                        <input
                                            id="country"
                                            type="text"
                                            title={ENUSStrings.CustomerCountryLabel}
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
                                <div id="customer-zip-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CustomerZipLabel}</span>
                                        <input
                                            id="zip"
                                            type="text"
                                            title={ENUSStrings.CustomerZipLabel}
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
                                <div id="customer-is-active-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.IsCustomerActiveLabel}</span>
                                        <input
                                            id="isActive"
                                            type="checkbox"
                                            title={ENUSStrings.IsCustomerActiveLabel}
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
                                        title={ENUSStrings.SubmitCustomerLabel}
                                    >
                                        {ENUSStrings.SubmitCustomerLabel}
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