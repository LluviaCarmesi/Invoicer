import React, { Component } from "react";
import SETTINGS from "../../AppSettings";
import "./Transaction.css";
import getCustomers from "../../services/GetCustomers";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import changeQueryParameter from "../../utilities/ChangeQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";
import ENUSStrings from "../../strings/ENUSStrings";
import transactionFormValidation from "../../utilities/validation/TransactionFormValidation";
import formatDate from "../../utilities/FormatDate";
import createHTMLOptions from "../../utilities/CreateHTMLOptions";
import isValueNumber from "../../utilities/validation/IsValueNumber";
import addTransaction from "../../services/AddTransaction";
import editTransaction from "../../services/EditTransaction";
import getTransaction from "../../services/GetTransaction";
import getCookie from "../../utilities/GetCookie";
import setCookie from "../../utilities/SetCookie";

export default class Transaction extends Component {
    constructor(props) {
        super(props);
        const todaysDate = formatDate(new Date());
        this.state = {
            currentType: "invoice",
            customers: [],
            currentCustomerID: 0,
            currentTransactionID: 0,
            loadingMessageCustomers: ENUSStrings.LoadingCustomersLabel,
            loadingMessageTransaction: ENUSStrings.LoadingTransactionLabel,
            isLoadingCustomers: true,
            isLoadingTransaction: true,
            errorTransaction: "",
            errorCustomers: "",
            createdDate: null,
            paymentDate: todaysDate,
            dueDate: todaysDate,
            checkNumber: "",
            total: "0",
            dueDateError: "",
            paymentDateError: "",
            totalError: "",
            invoiceData: [{
                type: "fuel",
                ticketNumber: "",
                total: "0"
            }],
            isSubmissionAttempted: false,
            wasSubmissionFailure: false,
            wasSubmissionSuccessful: false,
            submissionErrorMessage: "",
            isSuccessFailureMessageClosed: true,
            isSubmissionButtonClicked: false
        };
    }

    async loadTransaction(transactionID) {
        let transaction = {
            errorTransaction: "",
            customerID: 0,
            id: 0,
            type: "",
            createdDate: new Date(),
            paymentDate: formatDate(new Date()),
            dueDate: formatDate(new Date()),
            checkNumber: "",
            total: 0.00,
            invoiceData: [{
                type: "fuel",
                ticketNumber: "",
                total: "0"
            }],
        };

        if (!!transactionID) {
            const transactionInformation = await getTransaction(transactionID);
            if (transactionInformation.doesErrorExist) {
                transaction.errorTransaction = transactionInformation.errorMessage;
                return transaction;
            }
            transaction.customerID = transactionInformation.transaction.customerID;
            transaction.id = transactionInformation.transaction.id;
            transaction.type = transactionInformation.transaction.type;
            transaction.createdDate = new Date(transactionInformation.transaction.createdDate);
            transaction.paymentDate = transaction.type === SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT ?
                formatDate(new Date(transactionInformation.transaction.paymentDate)) :
                formatDate(new Date(transactionInformation.transaction.dueDate));
            transaction.dueDate = transaction.type === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE ?
                formatDate(new Date(transactionInformation.transaction.dueDate)) :
                formatDate(new Date(transactionInformation.transaction.paymentDate));
            transaction.checkNumber = transactionInformation.transaction.checkNumber;
            transaction.total = transactionInformation.transaction.total;
            transaction.invoiceData = transactionInformation.transaction.invoiceData;
        }
        return transaction;
    }

    async loadCustomers(customerID, transactionID, type) {
        const customersInformation = await getCustomers();
        if (customersInformation.doesErrorExist) {
            this.setState({
                errorCustomers: customersInformation.errorMessage,
                isLoadingCustomers: false,
                isLoadingTransaction: false
            });
            return;
        }
        const customersReturned = customersInformation.customers;
        const currentCustomerCookie = getCookie(SETTINGS.COOKIE_KEYS.CHOSEN_CUSTOMER);
        let filteredCustomerByID = [];
        if (!!customerID) {
            filteredCustomerByID = customersReturned.filter((customer) => customer.id === customerID);
        }
        else if (!!currentCustomerCookie) {
            filteredCustomerByID = customersReturned.filter((customer) => customer.id === parseInt(currentCustomerCookie));
        }
        const currentCustomer = filteredCustomerByID.length === 1 ? filteredCustomerByID[0] : customersReturned[0];
        const transaction = await this.loadTransaction(transactionID);
        this.setState({
            currentCustomerID: !!transaction.customerID ? transaction.customerID : currentCustomer.id,
            customers: customersReturned,
            currentTransactionID: transaction.id,
            currentType: !!transaction.type ? transaction.type : type,
            createdDate: transaction.createdDate,
            paymentDate: transaction.paymentDate,
            dueDate: transaction.dueDate,
            checkNumber: transaction.checkNumber,
            total: transaction.total,
            invoiceData: transaction.invoiceData,
            errorTransaction: transaction.errorTransaction,
            isLoadingCustomers: false,
            isLoadingTransaction: false
        });
    }

    componentDidMount() {
        loadingMessage("loading-customers-container", this.state.loadingMessageCustomers, this.state.loadingMessageCustomers);
        loadingMessage("loading-transaction-container", this.state.loadingMessageTransaction, this.state.loadingMessageTransaction);
        const idQueryParamValue = checkQueryParameter(SETTINGS.ID_QUERY_PARAMETER);
        const typeQueryParamValue = checkQueryParameter(SETTINGS.TYPE_QUERY_PARAMETER);
        const customerIDQueryParamValue = checkQueryParameter(SETTINGS.CUSTOMER_ID_QUERY_PARAMETER);
        const type = typeQueryParamValue === SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT ? typeQueryParamValue : SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE;
        const transactionID = isNaN(idQueryParamValue) ? 0 : parseInt(idQueryParamValue);
        const customerID = isNaN(customerIDQueryParamValue) ? 0 : parseInt(customerIDQueryParamValue);
        this.loadCustomers(customerID, transactionID, type);
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }
    render() {
        const submissionItem = {
            customerID: this.state.currentCustomerID,
            type: this.state.currentType,
            createdDate: !!this.state.createdDate ? this.state.createdDate : new Date(),
            dueDate: this.state.dueDate,
            paymentDate: this.state.paymentDate,
            checkNumber: this.state.checkNumber,
            invoiceData: this.state.invoiceData,
            total: this.state.total,
        };

        const changeCustomer = (value) => {
            const valueToInt = parseInt(value);
            setCookie(SETTINGS.COOKIE_KEYS.CHOSEN_CUSTOMER, valueToInt);
            this.setState({
                currentCustomerID: valueToInt
            });
            changeQueryParameter(SETTINGS.CUSTOMER_ID_QUERY_PARAMETER, value);
        };

        const calculateTotal = (currentInvoiceData) => {
            let total = 0;
            for (let i = 0; i < currentInvoiceData.length; i++) {
                const currentIteration = currentInvoiceData[i];
                if (isValueNumber(currentIteration.total)) {
                    total += parseFloat(currentIteration.total);
                }
            }
            total = parseFloat(total.toFixed(2));
            return total;
        }

        const cleanInvoiceData = () => {
            let modifiedInvoiceData = this.state.invoiceData;
            let currentPositionChange = 0;
            for (let i = 0; i < this.state.invoiceData.length; i++) {
                if (
                    modifiedInvoiceData[i].total === "0" ||
                    !modifiedInvoiceData[i].type
                ) {
                    modifiedInvoiceData.splice(i - currentPositionChange, 1);
                    currentPositionChange++;
                }
                else {
                    modifiedInvoiceData[i].total = parseFloat(modifiedInvoiceData[i].total);
                }
            }
            return modifiedInvoiceData;
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
            if (currentNumberofRows < 1) {
                rows.push(
                    <button
                        className="add-button"
                        onClick={() => {
                            this.setState({
                                invoiceData: [{
                                    type: "fuel",
                                    ticketNumber: "",
                                    total: "0"
                                }]
                            });
                        }}
                    >
                        {ENUSStrings.AddInvoiceDataLabel}
                    </button>
                );
                return rows;
            }
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
            this.setState({
                [id]: parseFloat(value).toFixed(2)
            })
        }

        const closeSuccessFailureMessage = () => {
            this.setState({
                isSuccessFailureMessageClosed: true
            });
        }

        const validateForm = (isSubmissionAttempted) => {
            const validation = transactionFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    dueDateError: validation.errors.dueDateError,
                    paymentDateError: validation.errors.paymentDateError,
                    totalError: validation.errors.totalError,
                    isSubmissionAttempted: isSubmissionAttempted
                });
            }
            else {
                this.setState({
                    dueDateError: validation.errors.dueDateError,
                    paymentDateError: validation.errors.paymentDateError,
                    totalError: validation.errors.totalError
                });
            }
            return validation.isValid;
        }

        const submitTransactionOnClick = async (event) => {
            event.preventDefault();
            let currentInformation = submissionItem;
            currentInformation.invoiceData = cleanInvoiceData();
            currentInformation.total = parseFloat(currentInformation.total);
            let isSuccessful = false;
            let errorMessage = "";
            if (!validateForm(true)) {
                return;
            }
            this.setState({
                isSubmissionButtonClicked: true,
                isSuccessFailureMessageClosed: true
            });
            if (!this.state.currentTransactionID) {
                const transactionAddition = await addTransaction(currentInformation, this.state.currentCustomerID);
                isSuccessful = !transactionAddition.doesErrorExist;
                errorMessage = transactionAddition.errorMessage;
                if (isSuccessful) {
                    currentInformation.checkNumber = "";
                    currentInformation.invoiceData = [{
                        type: "fuel",
                        ticketNumber: "",
                        total: "0"
                    }];
                    currentInformation.total = "";
                }
            }
            else {
                const transactionAddition = await editTransaction(currentInformation, this.state.currentTransactionID);
                isSuccessful = !transactionAddition.doesErrorExist;
                errorMessage = transactionAddition.errorMessage;
            }
            this.setState({
                checkNumber: currentInformation.checkNumber,
                invoiceData: currentInformation.invoiceData,
                total: currentInformation.total,
                wasSubmissionSuccessful: isSuccessful,
                wasSubmissionFailure: !isSuccessful,
                submissionErrorMessage: errorMessage,
                isSuccessFailureMessageClosed: false,
                isSubmissionButtonClicked: false
            });
        };

        return (
            <div className="transaction-container">
                <div>
                    <div id="loading-customers-container" hidden={!this.state.isLoadingCustomers}>
                        <span>{this.state.loadingMessageCustomers}</span>
                    </div>
                    <div hidden={!this.state.errorCustomers}>
                        <span>{this.state.errorCustomers}</span>
                    </div>
                    <div className="submission-loading-overlay" hidden={!this.state.isSubmissionButtonClicked}>
                        <span>{ENUSStrings.TransactionIsSubmittedMessage}</span>
                    </div>
                    <div hidden={this.state.isSuccessFailureMessageClosed}>
                        <div className="error-background" hidden={!this.state.wasSubmissionFailure}>
                            <span>{ENUSStrings.TransactionSubmissionFailedMessage}</span>
                            <span>{this.state.submissionErrorMessage}</span>
                        </div>
                        <div className="success-background" hidden={!this.state.wasSubmissionSuccessful}>
                            <span>{ENUSStrings.TransactionSubmissionSuccessMessage}</span>
                        </div>
                        <button className="remove-button" onClick={closeSuccessFailureMessage}>{ENUSStrings.CloseLabel}</button>
                    </div>
                    <div className="create-transaction-container" hidden={this.state.currentTransactionID === 0}>
                        <a href={`/transaction?type=${this.state.currentType}&customerID=${this.state.currentCustomerID}`}>
                            <span>{ENUSStrings.CreateTransactionLabel}</span>
                        </a>
                    </div>
                    {!this.state.errorCustomers && !this.state.isLoadingCustomers &&
                        <div id="transaction-customers-container" className="field-whole-container">
                            <div className="transaction-field-label-input-container">
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
                </div>
                <div className="info-container" hidden={!!this.state.errorCustomers}>
                    <div id="loading-transaction-container" hidden={!this.state.isLoadingTransaction}>
                        <span>{this.state.loadingMessageTransaction}</span>
                    </div>
                    <div hidden={!this.state.errorTransaction}>
                        <span>{this.state.errorTransaction}</span>
                    </div>
                    {!this.state.isLoadingTransaction && !this.state.errorTransaction &&
                        <React.Fragment>
                            <form onSubmit={submitTransactionOnClick}>
                                <div id="transaction-due-date-container" className="field-whole-container" hidden={!this.state.currentTransactionID}>
                                    <div className="transaction-field-label-input-container">
                                        <span className="field-label">{ENUSStrings.CreatedDateLabel}</span>
                                        <span>{formatDate(this.state.createdDate)}</span>
                                    </div>
                                </div>
                                <div id="transaction-type-container" className="field-whole-container">
                                    <div className="transaction-field-label-input-container">
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
                                <div id="transaction-due-date-container" className="field-whole-container" hidden={this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT}>
                                    <div className="transaction-field-label-input-container">
                                        <span className="field-label">{ENUSStrings.DueDateLabel}</span>
                                        <input
                                            type="date"
                                            id="dueDate"
                                            title={ENUSStrings.DueDateLabel}
                                            value={this.state.dueDate}
                                            onChange={(control) => { changeValue(control.target.value, control.target.id); }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.dueDateError || !this.state.isSubmissionAttempted}>
                                        {this.state.dueDateError}
                                    </span>
                                </div>
                                <div id="transaction-due-payment-date-container" className="field-whole-container" hidden={this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE}>
                                    <div className="transaction-field-label-input-container">
                                        <span className="field-label">{ENUSStrings.PaymentDateLabel}</span>
                                        <input
                                            type="date"
                                            id="paymentDate"
                                            title={ENUSStrings.PaymentDateLabel}
                                            value={this.state.paymentDate}
                                            onChange={(control) => { changeValue(control.target.value, control.target.id); }}
                                        />
                                    </div>
                                    <span className="field-error" hidden={!this.state.paymentDateError || !this.state.isSubmissionAttempted}>
                                        {this.state.paymentDateError}
                                    </span>
                                </div>
                                <div id="transaction-check-number-container" className="field-whole-container" hidden={this.state.currentType !== "payment"} >
                                    <div className="transaction-field-label-input-container">
                                        <span className="field-label">{ENUSStrings.CheckNumberLabel}</span>
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
                                </div>
                                <div id="transaction-total-container" className="field-whole-container" >
                                    {this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE &&
                                        <div className="transaction-field-label-input-container">
                                            <span className="field-label"></span>
                                            <span className="total">{ENUSStrings.TransactionTotalLabel} <b>{this.state.total}</b></span>
                                        </div>
                                    }
                                    {this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT &&
                                        <React.Fragment>
                                            <div className="transaction-field-label-input-container">
                                                <span className="field-label field-required">{ENUSStrings.TotalLabel}</span>
                                                <input
                                                    type="number"
                                                    id="total"
                                                    title={ENUSStrings.TotalLabel}
                                                    value={this.state.total}
                                                    onChange={(control) => {
                                                        changeValue(parseFloat(control.target.value), control.target.id);
                                                        submissionItem.total = control.target.value;
                                                        validateForm();
                                                    }}
                                                    onBlur={(control) => {
                                                        changeValueToDecimal(control.target.value, control.target.id);
                                                    }}
                                                />
                                            </div>
                                            <span className="field-error" hidden={!this.state.totalError || !this.state.isSubmissionAttempted}>{this.state.totalError}</span>
                                        </React.Fragment>
                                    }
                                </div>
                                <div id="print-container" hidden={!this.state.currentTransactionID}>
                                    <div className="transaction-field-label-input-container">
                                        <span><a
                                            href={`/print-transaction?id=${this.state.currentTransactionID}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {ENUSStrings.PrintTransactionLabel}</a>
                                        </span>
                                    </div>
                                </div>
                                {this.state.currentType === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE &&
                                    <div id="transaction-invoice-data-container" className="field-whole-container" >
                                        <div className="transaction-field-label-input-container">
                                            <table className="invoice-data-table">
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
                                    <button
                                        disabled={this.state.isSubmissionButtonClicked}
                                        className="primary-button"
                                        type="submit"
                                    >{ENUSStrings.SubmitTransactionLabel}
                                    </button>
                                </div>
                            </form>
                        </React.Fragment>
                    }
                </div>
            </div >
        );
    }
}