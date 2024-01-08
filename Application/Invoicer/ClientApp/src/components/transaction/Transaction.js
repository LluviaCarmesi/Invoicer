import React, { Component } from "react";
import SETTINGS from "../../AppSettings";
import "./Transaction.css";
import getCompanies from "../../services/GetCompanies";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import changeQueryParameter from "../../utilities/ChangeQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";
import ENUSStrings from "../../strings/ENUSStrings";
import transactionFormValidation from "../../utilities/validation/TransactionFormValidation";
import isValueNumber from "../../utilities/validation/IsValueNumber";
import getTodaysDate from "../../utilities/GetTodaysDate";
import createCompanyOptions from "../../utilities/CreateHTMLOptions";

export default class Transaction extends Component {
    constructor(props) {
        super(props);
        const todaysDate = getTodaysDate();
        this.state = {
            currentType: "invoice",
            companies: [],
            currentCompanyID: 0,
            currentTransactionID: 0,
            transaction: {},
            loadingMessageCompanies: "Loading Companies",
            loadingMessageTransaction: "Loading Transaction",
            isLoadingCompanies: true,
            isLoadingTransaction: true,
            errorTransaction: "",
            errorCompanies: "",
            paymentDate: todaysDate,
            dueDate: todaysDate,
            checkNumber: "",
            total: "",
            dueDateError: "",
            paymentDateError: "",
            checkNumberError: "",
            totalError: "",
            isSubmissionAttempted: false
        };
    }

    async loadTransaction(transactionID) {

    }

    async loadCompanies(transactionID) {
        const companyInformation = await getCompanies();
        const firstCompany = companyInformation.companies.length > 0 ? companyInformation.companies[0] : { id: 0, name: "" };
        if (!!transactionID) {
            this.loadTransaction(transactionID);
        }
        this.setState({
            currentCompanyID: firstCompany.id,
            companies: companyInformation.companies,
            errorCompanies: companyInformation.error,
            isLoadingCompanies: false,
            isLoadingTransaction: false
        });
    }

    componentDidMount() {
        loadingMessage("loading-companies-container", this.state.loadingMessageCompanies, this.state.loadingMessageCompanies);
        loadingMessage("loading-transaction-container", this.state.loadingMessageTransaction, this.state.loadingMessageTransaction);
        const idQueryParamValue = checkQueryParameter(SETTINGS.ID_QUERY_PARAMETER);
        const typeQueryParamValue = checkQueryParameter(SETTINGS.TYPE_QUERY_PARAMETER);
        const companyIDQueryParamValue = checkQueryParameter(SETTINGS.COMPANY_ID_QUERY_PARAMETER);
        this.loadCompanies(idQueryParamValue);
        if (!!idQueryParamValue) {

        }
        else {
            const type = typeQueryParamValue === "payment" ? typeQueryParamValue : "invoice";
            const companyID = isNaN(companyIDQueryParamValue) ? 0 : parseInt(companyIDQueryParamValue);

            this.setState({
                currentType: type,
                currentCompanyID: companyID,
            });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }
    render() {
        const changeCompany = (value) => {
            this.setState({
                currentCompanyID: value
            });
            changeQueryParameter(SETTINGS.COMPANY_ID_QUERY_PARAMETER, value);
        };

        const submissionItem = {
            type: this.state.currentType,
            createdDate: new Date(),
            dueDate: this.state.dueDate,
            paymentDate: this.state.paymentDate,
            checkNumber: this.state.checkNumber,
            total: this.state.total,
        };

        const changeType = (value) => {
            this.setState({ currentType: value })
            changeQueryParameter(SETTINGS.TYPE_QUERY_PARAMETER, value);
        };

        const changeValue = (value, id) => {
            this.setState({
                [id]: value
            });
        };

        const changeValueToDecimal = (value, id) => {
            console.log(parseFloat(value).toFixed(2))
            this.setState({
                [id]: parseFloat(value).toFixed(2)
            })
        }

        const validateForm = (isSubmissionAttempted) => {
            const validation = transactionFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    dueDateError: validation.errors.dueDateError,
                    paymentDateError: validation.errors.paymentDateError,
                    checkNumberError: validation.errors.checkNumberError,
                    totalError: validation.errors.totalError,
                    isSubmissionAttempted: isSubmissionAttempted
                });
            }
            else {
                this.setState({
                    dueDateError: validation.errors.dueDateError,
                    paymentDateError: validation.errors.paymentDateError,
                    checkNumberError: validation.errors.checkNumberError,
                    totalError: validation.errors.totalError
                });
            }
            return validation.isValid;
        }

        const createTransactionOnClick = (event) => {
            event.preventDefault();
            if (validateForm(true)) {

            }
        };

        return (
            <div className="transaction-container">
                <div>
                    <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                        <span>{this.state.loadingMessageCompanies}</span>
                    </div>
                    <div hidden={!this.state.errorCompanies}>
                        <span>{this.state.errorCompanies}</span>
                    </div>
                    {!this.state.errorCompanies && !this.state.isLoadingCompanies &&
                        <div id="transaction-companies-container" className="field-whole-container">
                            <div className="field-label-input-container">
                                <span className="field-label">{ENUSStrings.ChooseCompanyLabel}</span>
                                <select id="company-dropdown" onChange={(control) => changeCompany(control.target.value)} value={this.state.currentCompanyID}>
                                    {createCompanyOptions(this.state.companies)}
                                </select>
                            </div>
                        </div>
                    }
                </div>
                <div className="info-container" hidden={!!this.state.errorCompanies}>
                    <div id="loading-transaction-container" hidden={!this.state.isLoadingTransaction}>
                        <span>{this.state.loadingMessageTransaction}</span>
                    </div>
                    <div hidden={!this.state.errorTransaction}>
                        <span>{this.state.errorTransaction}</span>
                    </div>
                    {!this.state.isLoadingTransaction && !this.state.errorTransaction &&
                        <React.Fragment>
                            <form onSubmit={createTransactionOnClick}>
                                <div id="transaction-type-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.ChooseTypeLabel}</span>
                                        <select id="type-dropdown" onChange={(control) => changeType(control.target.value)} value={this.state.currentType}>
                                            <option value={SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE}>{ENUSStrings.InvoiceLabel}</option>
                                            <option value={SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT}>{ENUSStrings.PaymentLabel}</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="transaction-due-payment-date-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label">{this.state.currentType !== "invoice" ? ENUSStrings.PaymentDateLabel : ENUSStrings.DueDateLabel}</span>
                                        <input
                                            type="date"
                                            id="duePaymentDate"
                                            value={this.state.currentType !== "invoice" ? this.state.paymentDate : this.state.dueDate}
                                            onChange={(control) => {changeValue(control.target.value, control.target.id);}}
                                        />
                                    </div>
                                    <span className="field-error" hidden={this.state.currentType !== "invoice" ? (!this.state.paymentDateError || !this.state.isSubmissionAttempted) : (!this.state.dueDateError || !this.state.isSubmissionAttempted)}>
                                        {this.state.currentType !== "invoice" ? this.state.paymentDateError : this.state.dueDateError}
                                    </span>
                                </div>
                                <div id="transaction-check-number-container" className="field-whole-container" hidden={this.state.currentType !== "payment"} >
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CheckNumberLabel}</span>
                                        <input
                                            type="text"
                                            id="checkNumber"
                                            value={this.state.checkNumber}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.checkNumber = control.target.value;
                                                validateForm();
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.checkNumberError || !this.state.isSubmissionAttempted}>{this.state.checkNumberError}</span>
                                </div>
                                <div id="transaction-total-container" className="field-whole-container" >
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.TotalLabel}</span>
                                        <input
                                            type="text"
                                            id="total"
                                            value={this.state.total}
                                            onChange={(control) => {
                                                changeValue(control.target.value, control.target.id);
                                                submissionItem.total = control.target.value;
                                                validateForm();
                                            }}
                                            onBlur={(control) => {
                                                if (isValueNumber(control.target.value)) {
                                                    changeValueToDecimal(control.target.value, control.target.id);
                                                }
                                            }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.totalError || !this.state.isSubmissionAttempted}>{this.state.totalError}</span>
                                </div>
                                <div className="buttons-container">
                                    <button className="primary-button" type="submit">{ENUSStrings.SubmitTransactionLabel}</button>
                                </div>
                            </form>
                        </React.Fragment>
                    }
                </div>
            </div >
        );
    }
}