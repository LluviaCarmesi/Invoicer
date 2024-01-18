import React, { Component } from "react";
import SETTINGS from "../../AppSettings";
import "./Transaction.css";
import getCompanies from "../../services/GetCompanies";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import changeQueryParameter from "../../utilities/ChangeQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";
import ENUSStrings from "../../strings/ENUSStrings";
import transactionFormValidation from "../../utilities/validation/TransactionFormValidation";
import getTodaysDate from "../../utilities/GetTodaysDate";
import createCompanyOptions from "../../utilities/CreateHTMLOptions";
import isValueNumber from "../../utilities/validation/IsValueNumber";
import addTransaction from "../../services/AddTransaction";

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
            total: "0",
            dueDateError: "",
            paymentDateError: "",
            checkNumberError: "",
            totalError: "",
            invoiceData: [{
                type: "fuel",
                ticketNumber: "",
                total: "0"
            }],
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
        const submissionItem = {
            type: this.state.currentType,
            createdDate: new Date(),
            dueDate: this.state.dueDate,
            paymentDate: this.state.paymentDate,
            checkNumber: this.state.checkNumber,
            total: this.state.total,
        };

        const changeCompany = (value) => {
            this.setState({
                currentCompanyID: value
            });
            changeQueryParameter(SETTINGS.COMPANY_ID_QUERY_PARAMETER, value);
        };

        const calculateTotal = (currentInvoiceData) => {
            let total = 0;
            for (let i = 0; i < currentInvoiceData.length; i++) {
                const currentIteration = currentInvoiceData[i];
                if (isValueNumber(currentIteration.total)) {
                    total += parseFloat(currentIteration.total);
                }
            }
            return total;
        }

        const removeInvoiceDataRow = (position, currentInvoiceData) => {
            currentInvoiceData.splice(position, 1);
            const currentTotal = calculateTotal(currentInvoiceData);
            this.setState({
                invoiceData: currentInvoiceData,
                total: currentTotal
            });
        }

        const editInvoiceDataRow = (value, id, currentInvoiceData) => {
            let currentTotal = this.state.total;
            const idSplitted = id.split(":");
            const lastItemInInvoiceData = currentInvoiceData[currentInvoiceData.length - 1];
            const secondToLastItemInInvoiceData = currentInvoiceData[currentInvoiceData.length - 2];
            currentInvoiceData[idSplitted[1]][idSplitted[0]] = value;
            if (
                !!lastItemInInvoiceData.ticketNumber ||
                (!!lastItemInInvoiceData.total && lastItemInInvoiceData.total !== "0")
            ) {
                currentInvoiceData.push({
                    type: "fuel",
                    ticketNumber: "",
                    total: "0"
                });
            }
            else if (
                !!secondToLastItemInInvoiceData &&
                (
                    !lastItemInInvoiceData.ticketNumber &&
                    (!lastItemInInvoiceData.total || lastItemInInvoiceData.total === "0")
                ) &&
                (
                    !secondToLastItemInInvoiceData.ticketNumber &&
                    (!secondToLastItemInInvoiceData.total || secondToLastItemInInvoiceData.total === "0")
                )
            ) {
                currentInvoiceData.splice(currentInvoiceData.length - 1, 1);
            }
            if (idSplitted[0] === "total") {
                currentTotal = calculateTotal(currentInvoiceData);
            }
            this.setState({
                invoiceData: currentInvoiceData,
                total: currentTotal
            });
        }

        const createInvoiceDataRows = () => {
            let rows = [];
            const currentNumberofRows = this.state.invoiceData.length;
            console.log(this.state.invoiceData);
            const currentInvoiceData = [...this.state.invoiceData];
            for (let i = 0; i < currentNumberofRows; i++) {
                rows.push(
                    <tr key={i + 1}>
                        <td>
                            <select
                                id={"type:" + i}
                                title={ENUSStrings.TypeLabel + ": " + i}
                                value={this.state.invoiceData[i].type}
                                onChange={(control) => {
                                    editInvoiceDataRow(control.target.value, control.target.id, currentInvoiceData)
                                }}
                            >
                                <option value={SETTINGS.INVOICE_DATA_TYPE_CHOICES.FUEL}>{ENUSStrings.FuelLabel}</option>
                            </select>
                        </td>
                        <td>
                            <input
                                id={"ticketNumber:" + i}
                                type="text"
                                title={ENUSStrings.TicketNumberLabel + ": " + i}
                                value={this.state.invoiceData[i].ticketNumber}
                                onChange={(control) => {
                                    editInvoiceDataRow(control.target.value, control.target.id, currentInvoiceData)
                                }}
                            >
                            </input>
                        </td>
                        <td>
                            <input
                                id={"total:" + i}
                                type="number"
                                title={ENUSStrings.TotalLabel + ": " + i}
                                value={this.state.invoiceData[i].total}
                                onChange={(control) => {
                                    editInvoiceDataRow(control.target.value, control.target.id, currentInvoiceData)
                                }}
                            >
                            </input>
                        </td>
                        <td>
                            {!!i &&
                                <button
                                    className="remove-button"
                                    onClick={() => {
                                        removeInvoiceDataRow(i, currentInvoiceData)
                                    }}
                                >
                                    {ENUSStrings.RemoveLabel}
                                </button>
                            }
                        </td>
                    </tr>
                )
            }
            return rows;
        }

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
                addTransaction(submissionItem, 1)
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
                                <select
                                    id="company-dropdown"
                                    onChange={(control) => changeCompany(control.target.value)}
                                    title={ENUSStrings.ChooseCompanyLabel}
                                    value={this.state.currentCompanyID}
                                >
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
                                        <select
                                            id="type-dropdown"
                                            title={ENUSStrings.ChooseTypeLabel}
                                            onChange={(control) => changeType(control.target.value)}
                                            value={this.state.currentType}
                                        >
                                            <option value={SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE}>{ENUSStrings.InvoiceLabel}</option>
                                            <option value={SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT}>{ENUSStrings.PaymentLabel}</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="transaction-due-payment-date-container" className="field-whole-container">
                                    <div className="field-label-input-container">
                                        <span className="field-label">{this.state.currentType !== SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE ? ENUSStrings.PaymentDateLabel : ENUSStrings.DueDateLabel}</span>
                                        <input
                                            type="date"
                                            id="duePaymentDate"
                                            title={this.state.currentType !== SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE ? ENUSStrings.PaymentDateLabel : ENUSStrings.DueDateLabel}
                                            value={this.state.currentType !== SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE ? this.state.paymentDate : this.state.dueDate}
                                            onChange={(control) => { changeValue(control.target.value, control.target.id); }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={this.state.currentType !== SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE ? (!this.state.paymentDateError || !this.state.isSubmissionAttempted) : (!this.state.dueDateError || !this.state.isSubmissionAttempted)}>
                                        {this.state.currentType !== SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE ? this.state.paymentDateError : this.state.dueDateError}
                                    </span>
                                </div>
                                <div id="transaction-check-number-container" className="field-whole-container" hidden={this.state.currentType !== "payment"} >
                                    <div className="field-label-input-container">
                                        <span className="field-label field-required">{ENUSStrings.CheckNumberLabel}</span>
                                        <input
                                            type="text"
                                            id="checkNumber"
                                            title={ENUSStrings.CheckNumberLabel}
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
                                    {this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE &&
                                        < div className="field-label-input-container">
                                            <span className="field-label"></span>
                                            <span className="total">{ENUSStrings.TransactionTotalLabel} {this.state.total}</span>
                                        </div>
                                    }
                                    {this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT &&
                                        <React.Fragment>
                                            <div className="field-label-input-container">
                                                <span className="field-label field-required">{ENUSStrings.TotalLabel}</span>
                                                <input
                                                    type="number"
                                                    id="total"
                                                    title={ENUSStrings.TotalLabel}
                                                    value={this.state.total}
                                                    onChange={(control) => {
                                                        changeValue(control.target.value, control.target.id);
                                                        submissionItem.total = control.target.value;
                                                        validateForm();
                                                    }}
                                                />
                                            </div>
                                            <span className="field-error" hidden={!this.state.totalError || !this.state.isSubmissionAttempted}>{this.state.totalError}</span>
                                        </React.Fragment>
                                    }
                                </div>
                                {this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE &&
                                    <div id="transaction-invoice-data-container" className="field-whole-container" >
                                        <div className="field-label-input-container">
                                            <table>
                                                <thead>
                                                    <tr key={0}>
                                                        <th>{ENUSStrings.TypeLabel}</th>
                                                        <th>{ENUSStrings.TicketNumberLabel}</th>
                                                        <th>{ENUSStrings.TotalLabel}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {createInvoiceDataRows()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
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