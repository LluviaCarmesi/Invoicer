﻿import React, { Component } from 'react';
import addCompany from '../../services/AddCompany';
import ENUSStrings from '../../strings/ENUSStrings';
import companyFormValidation from '../../utilities/validation/CompanyFormValidation';

export default class CompanySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentType: "",
            currentCompanyID: 0,
            companyName: "",
            companyPhone: "",
            companyEmail: "",
            companyAddress: "",
            companyCity: "",
            companyCountry: "",
            companyZip: "",
            companyNameError: "",
            companyPhoneError: "",
            companyEmailError: "",
            companyAddressError: "",
            companyCityError: "",
            companyCountryError: "",
            companyZipError: "",
            isSubmissionAttempted: false,
            isCompanyChosen: false
        };
    }

    componentDidMount() {
        const { type } = this.props;
        this.setState({
            currentType: type,
            isCompanyChosen: type === "new" ? true : false
        });
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
            companyZip: this.state.companyZip
        };
        const changeTextValue = (value, id) => {
            console.log(value + " " + id);
            this.setState({
                [id]: value
            });
        };

        const createCompanyOnClick = () => {
            const validation = companyFormValidation(submissionItem);
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
            if (validation.isValid) {
                addCompany({
                    name: "howdy",
                    email: ""
                });
            }
        };

        return (
            <div className="company-settings-container">
                {this.state.isCompanyChosen &&
                    <React.Fragment>
                        <h3 hidden={this.state.currentType !== "new"}>Create a New Company</h3>
                        <h3 hidden={this.state.currentType !== "edit"}>Edit the Company</h3>
                        <div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label field-required">{ENUSStrings.CompanyNameLabel}</span>
                                    <input
                                        id="companyName"
                                        type="text"
                                        value={this.state.companyName}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyNameError || !this.state.isSubmissionAttempted}>{this.state.companyNameError}</span>
                            </div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label field-required">{ENUSStrings.CompanyPhoneLabel}</span>
                                    <input
                                        id="companyPhone"
                                        type="text"
                                        value={this.state.companyPhone}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyPhoneError || !this.state.isSubmissionAttempted}>{this.state.companyPhoneError}</span>
                            </div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label">{ENUSStrings.CompanyEmailLabel}</span>
                                    <input
                                        id="companyEmail"
                                        type="text"
                                        value={this.state.companyEmail}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyEmailError || !this.state.isSubmissionAttempted}>{this.state.companyEmailError}</span>
                            </div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label field-required">{ENUSStrings.CompanyAddressLabel}</span>
                                    <input
                                        id="companyAddress"
                                        type="text"
                                        value={this.state.companyAddress}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyAddressError || !this.state.isSubmissionAttempted}>{this.state.companyAddressError}</span>
                            </div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label field-required">{ENUSStrings.CompanyCityLabel}</span>
                                    <input
                                        id="companyCity"
                                        type="text"
                                        value={this.state.companyCity}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyCityError || !this.state.isSubmissionAttempted}>{this.state.companyCityError}</span>
                            </div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label field-required">{ENUSStrings.CompanyCountryLabel}</span>
                                    <input
                                        id="companyCountry"
                                        type="text"
                                        value={this.state.companyCountry}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyCountryError || !this.state.isSubmissionAttempted}>{this.state.companyCountryError}</span>
                            </div>
                            <div id="company-name-container" className="field-whole-container">
                                <div className="field-label-input-container">
                                    <span className="field-label field-required">{ENUSStrings.CompanyZipLabel}</span>
                                    <input
                                        id="companyZip"
                                        type="text"
                                        value={this.state.companyZip}
                                        onChange={(control) => { changeTextValue(control.target.value, control.target.id) }}
                                    />
                                </div>
                                <span className="field-error" hidden={!this.state.companyZipError || !this.state.isSubmissionAttempted}>{this.state.companyZipError}</span>
                            </div>
                            <div className="buttons-container">
                                <button className="primary-button" onClick={createCompanyOnClick}>Create Company</button>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </div>
        );
    }
}