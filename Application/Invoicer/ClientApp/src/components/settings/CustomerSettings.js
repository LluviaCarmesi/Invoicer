import React, { Component } from 'react';
import SETTINGS from '../../AppSettings';
import addCustomer from '../../services/AddCustomer';
import getCustomers from '../../services/GetCustomers';
import ENUSStrings from '../../strings/ENUSStrings';
import customerFormValidation from '../../utilities/validation/CustomerFormValidation';
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import loadingMessage from '../../utilities/LoadingMessage';
import editCustomer from "../../services/EditCustomer";

export default class CustomerSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            currentType: "",
            currentCustomerID: 0,
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
            isLoadingCustomers: true,
            errorCustomers: "",
            loadingMessageCustomers: ENUSStrings.LoadingCustomersLabel,
            isSubmissionAttempted: false,
            wasSubmissionFailure: false,
            wasSubmissionSuccessful: false,
            submissionErrorMessage: "",
            isSuccessFailureMessageClosed: true,
            isSubmissionButtonClicked: false
        };
    }

    async loadCustomers() {
        let currentCustomerInformation = {
            id: 0,
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
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
        const currentCustomer = customersInformation.customers.length > 0 ? customersInformation.customers[0] : { id: 0 };
        if (!!currentCustomer.id) {
            currentCustomerInformation.id = currentCustomer.id;
            currentCustomerInformation.name = currentCustomer.name;
            currentCustomerInformation.phone = currentCustomer.phone;
            currentCustomerInformation.email = currentCustomer.email;
            currentCustomerInformation.address = currentCustomer.address;
            currentCustomerInformation.city = currentCustomer.city;
            currentCustomerInformation.country = currentCustomer.country;
            currentCustomerInformation.zip = currentCustomer.zip;
            currentCustomerInformation.isActive = currentCustomer.isActive;
        }
        this.setState({
            currentCustomerID: currentCustomerInformation.id,
            customer: customersInformation.customers,
            name: currentCustomerInformation.name,
            phone: currentCustomerInformation.phone,
            email: currentCustomerInformation.email,
            address: currentCustomerInformation.address,
            city: currentCustomerInformation.city,
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
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {
            loadingMessage("loading-customers-container", this.state.loadingMessageCustomers, this.state.loadingMessageCustomers);
            this.loadCustomers();
        }
        else {
            this.setState({
                isLoadingCustomers: false,
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

        const changeCustomer = (value) => {
            const valueToInt = parseInt(value);
            const customer = this.state.customers.filter((customer) => customer.id === valueToInt)[0];
            this.setState({
                currentCustomerID: valueToInt,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                city: customer.city,
                country: customer.country,
                zip: customer.zip,
                isActive: customer.isActive
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
            const validation = customerFormValidation(submissionItem);
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

        const submitCustomerOnClick = async (event) => {
            event.preventDefault();
            let currentInformation = submissionItem;
            let isSuccessful = false;
            let errorMessage = "";
            if (validateForm(true)) {
                this.setState({
                    isSubmissionButtonClicked: true,
                    isSuccessFailureMessageClosed: true
                });
                if (!this.state.currentCustomerID) {
                    const customerAddition = await addCustomer(currentInformation);
                    isSuccessful = !customerAddition.doesErrorExist;
                    errorMessage = customerAddition.errorMessage;
                    if (isSuccessful) {
                        currentInformation.name = "";
                        currentInformation.phone = "";
                        currentInformation.email = "";
                        currentInformation.address = "";
                        currentInformation.city = "";
                        currentInformation.country = "";
                        currentInformation.zip = "";
                        currentInformation.isActive = true;
                    }
                }
                else {
                    const customerEdit = await editCustomer(currentInformation, this.state.currentCustomerID);
                    isSuccessful = !customerEdit.doesErrorExist;
                    errorMessage = customerEdit.errorMessage;
                }
                this.setState({
                    name: currentInformation.name,
                    phone: currentInformation.phone,
                    email: currentInformation.email,
                    address: currentInformation.address,
                    city: currentInformation.city,
                    country: currentInformation.country,
                    zip: currentInformation.zip,
                    isActive: currentInformation.isActive,
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
                        <span>{this.state.loadingMessageCustomers}</span>
                    </div>
                    <div hidden={!this.state.errorCustomers}>
                        <span>{this.state.errorCustomers}</span>
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
                    {!this.state.isLoadingCustomers && !this.state.errorCustomers &&
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
                                        <span className="field-label">{ENUSStrings.CustomerEmailLabel}</span>
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