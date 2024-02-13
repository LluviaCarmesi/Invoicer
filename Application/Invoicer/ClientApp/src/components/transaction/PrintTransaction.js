import React, { Component } from "react";
import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import formatDate from "../../utilities/FormatDate";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";
import getTransaction from "../../services/GetTransaction";
import getCustomer from "../../services/GetCustomer";
import "./PrintTransaction.css";
import getCompany from "../../services/GetCompany";

export default class PrintTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTransactionID: 0,
            loadingMessageTransaction: ENUSStrings.LoadingTransactionLabel,
            isLoadingTransaction: true,
            isTransactionPayment: false,
            errorTransaction: "",
            companyName: "",
            companyAddress: "",
            companyCity: "",
            companyState: "",
            companyCountry: "",
            companyZip: "",
            customerName: "",
            customerAddress: "",
            customerCity: "",
            customerState: "",
            customerCountry: "",
            customerZip: "",
            createdDate: null,
            paymentDate: null,
            dueDate: null,
            checkNumber: "",
            total: "0",
            invoiceData: [{
                type: "fuel",
                ticketNumber: "",
                total: "0"
            }]
        };
    }

    async loadCompany(companyID) {
        let company = {
            name: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zip: "",
        };
        if (!!companyID) {
            const companyInformationRequest = await getCompany(companyID);
            if (companyInformationRequest.doesErrorExist) {
                return company;
            }
            const companyInformation = companyInformationRequest.company;
            company.name = companyInformation.name;
            company.address = companyInformation.address;
            company.city = companyInformation.city;
            company.state = companyInformation.state;
            company.country = companyInformation.country;
            company.zip = companyInformation.zip;
        }
        return company;
    }

    async loadCustomer(customerID) {
        let customer = {
            companyID: 0,
            name: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zip: "",
        };
        if (!!customerID) {
            const customerInformationRequest = await getCustomer(customerID);
            if (customerInformationRequest.doesErrorExist) {
                return customer;
            }
            const customerInformation = customerInformationRequest.customer;
            customer.companyID = customerInformation.companyID;
            customer.name = customerInformation.name;
            customer.address = customerInformation.address;
            customer.city = customerInformation.city;
            customer.state = customerInformation.state;
            customer.country = customerInformation.country;
            customer.zip = customerInformation.zip;
        }
        console.log(customer.companyID);
        const company = await this.loadCompany(customer.companyID);
        return { customer, company };
    }

    async loadTransaction(transactionID) {
        let transaction = {};
        if (!!transactionID) {
            const transactionInformation = await getTransaction(transactionID);
            if (transactionInformation.doesErrorExist) {
                this.setState({
                    errorTransaction: transactionInformation.errorMessage,
                    isLoadingTransaction: false
                })
                return;
            }
            if (transactionInformation.type === SETTINGS.TRANSACTION_TYPE_CHOICES.PAYMENT) {
                this.setState({
                    isTransactionPayment: true,
                    isLoadingTransaction: false,
                    errorTransaction: ENUSStrings.TransactionIsPaymentMessage
                })
                return;
            }
            transaction = transactionInformation.transaction;
        }
        const customerCompanyInformation = await this.loadCustomer(transaction.customerID);
        this.setState({
            currentTransactionID: transaction.id,
            companyName: customerCompanyInformation.company.name,
            companyAddress: customerCompanyInformation.company.address,
            companyCity: customerCompanyInformation.company.city,
            companyState: customerCompanyInformation.company.state,
            companyCountry: customerCompanyInformation.company.country,
            companyZip: customerCompanyInformation.company.zip,
            customerName: customerCompanyInformation.customer.name,
            customerAddress: customerCompanyInformation.customer.address,
            customerCity: customerCompanyInformation.customer.city,
            customerState: customerCompanyInformation.customer.state,
            customerCountry: customerCompanyInformation.customer.country,
            customerZip: customerCompanyInformation.customer.zip,
            createdDate: new Date(transaction.createdDate),
            paymentDate: formatDate(new Date(transaction.paymentDate)),
            dueDate: formatDate(new Date(transaction.dueDate)),
            checkNumber: transaction.checkNumber,
            total: transaction.total,
            invoiceData: transaction.invoiceData,
            isLoadingTransaction: false
        });
        if (transaction.id !== 0) {
            setTimeout(() => {
                window.print();
            }, 250);
        }
    }

    componentDidMount() {
        loadingMessage("loading-transaction-container", this.state.loadingMessageTransaction, this.state.loadingMessageTransaction);
        const idQueryParamValue = checkQueryParameter(SETTINGS.ID_QUERY_PARAMETER);
        const transactionID = isNaN(idQueryParamValue) ? 0 : parseInt(idQueryParamValue);

        this.loadTransaction(transactionID);
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }

    render() {
        const createInvoiceDataRows = () => {
            let rows = [];
            for (let i = 0; i < this.state.invoiceData.length; i++) {
                const currentInvoiceData = this.state.invoiceData[i];
                rows.push(
                    <tr key={i + 1}>
                        <td><span>{currentInvoiceData.type}</span></td>
                        <td><span>{currentInvoiceData.ticketNumber}</span></td>
                        <td><span>{currentInvoiceData.total}</span></td>
                    </tr>
                );
            }
            return rows;
        }

        return (
            <div className="print-transaction-container">
                <div id="loading-transaction-container" hidden={!this.state.isLoadingTransaction}>
                    <span>{this.state.loadingMessageTransaction}</span>
                </div>
                <div hidden={!this.state.errorTransaction}>
                    <span>{this.state.errorTransaction}</span>
                </div>
                {!this.state.errorTransaction && !this.state.isLoadingTransaction &&
                    <div>
                        <div className="print-transaction-company-container">
                            <span>{this.state.companyName}</span>
                            <span>{this.state.companyAddress}</span>
                            <span>{this.state.companyState} {this.state.companyZip}</span>
                        </div>
                        <div className="print-transaction-invoice-id-container">
                            <span>{ENUSStrings.InvoiceLabel}: </span>
                            <span id="id-number">{this.state.currentTransactionID}</span>
                        </div>
                        <div className="print-transaction-customer-container">
                            <span>{this.state.customerName}</span>
                            <span>{this.state.customerAddress}</span>
                            <span>{this.state.customerCity}, {this.state.customerState} {this.state.customerZip}</span>
                        </div>
                        <div className="print-transaction-due-date-container">
                            <span>{ENUSStrings.DueDateLabel}: </span>
                            <span id="due-date">{this.state.dueDate}</span>
                        </div>
                        <div className="print-transaction-invoice-table-container">
                            <table className="invoice-table">
                                <thead>
                                    <tr key={0}>
                                        <th><span>{ENUSStrings.TypeLabel}</span></th>
                                        <th><span>{ENUSStrings.TicketNumberLabel}</span></th>
                                        <th><span>{ENUSStrings.TotalLabel}</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {createInvoiceDataRows()}
                                </tbody>
                            </table>
                        </div>
                        <div className="print-transaction-total-container">
                            <span>{ENUSStrings.TotalLabel}: </span>
                            <span id="total-number">{this.state.total}</span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}