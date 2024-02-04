import React, { Component } from "react";
import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import formatDate from "../../utilities/FormatDate";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";
import getTransaction from "../../services/GetTransaction";
import getCustomer from "../../services/GetCustomer";
import "./PrintTransaction.css";

export default class PrintTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTransactionID: 0,
            loadingMessageTransaction: ENUSStrings.LoadingTransactionLabel,
            isLoadingTransaction: true,
            isTransactionPayment: false,
            errorTransaction: "",
            customerName: "",
            customerAddress: "",
            customerCity: "",
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

    async loadCustomer(customerID) {
        let customer = {
            customerName: "",
            customerAddress: "",
            customerCity: "",
            customerCountry: "",
            customerZip: "",
        };
        if (!!customerID) {
            const customerInformationRequest = await getCustomer(customerID);
            if (customerInformationRequest.doesErrorExist) {
                return customer;
            }
            const customerInformation = customerInformationRequest.customer;
            customer.customerName = customerInformation.name;
            customer.customerAddress = customerInformation.address;
            customer.customerCity = customerInformation.city;
            customer.customerCountry = customerInformation.country;
            customer.customerZip = customerInformation.zip;
        }
        return customer;
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
        const customerInformation = await this.loadCustomer(transaction.customerID);
        this.setState({
            currentTransactionID: transaction.id,
            customerName: customerInformation.customerName,
            customerAddress: customerInformation.customerAddress,
            customerCity: customerInformation.customerCity,
            customerCountry: customerInformation.Country,
            customerZip: customerInformation.Zip,
            createdDate: new Date(transaction.createdDate),
            paymentDate: formatDate(new Date(transaction.paymentDate)),
            dueDate: formatDate(new Date(transaction.dueDate)),
            checkNumber: transaction.checkNumber,
            total: transaction.total,
            invoiceData: transaction.invoiceData,
            isLoadingTransaction: false
        });
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
                        <div className="invoice-id-container">
                            <span>{ENUSStrings.InvoiceLabel}: </span>
                            <span id="id-number">{this.state.currentTransactionID}</span>
                        </div>
                        <div className="customer-container">
                            <span>{this.state.customerAddress}</span>
                        </div>
                        <div className="due-date-container">
                            <span>{ENUSStrings.DueDateLabel}: </span>
                            <span id="due-date">{this.state.dueDate}</span>
                        </div>
                        <div className="invoice-table-container">
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
                        <div className="total-container">
                            <span>{ENUSStrings.TotalLabel}: </span>
                            <span id="total-number">{this.state.total}</span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}