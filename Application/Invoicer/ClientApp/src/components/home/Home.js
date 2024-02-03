import React, { Component } from 'react';
import loadingMessage from "../../utilities/LoadingMessage";
import getCustomers from "../../services/GetCustomers";
import getCustomerTransactions from "../../services/GetCustomerTransactions";
import "./Home.css";
import ENUSStrings from '../../strings/ENUSStrings';
import SETTINGS from '../../AppSettings';

async function getAccess() {
    await (() => { return true; });
};

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            currentCustomerID: 0,
            customers: [],
            transactions: [],
            remainingBalance: 0.00,
            errorCustomers: "",
            errorRemainingBalance: "",
            errorTransactions: "",
            loadingMessageCustomers: ENUSStrings.LoadingCustomersLabel,
            loadingMessageRemainingBalance: ENUSStrings.LoadingRemainingBalanceLabel,
            loadingMessageTransactions: ENUSStrings.LoadingTransactionsLabel,
            isLoadingCustomers: true,
            isLoadingTransactions: true
        };
    }

    async loadCustomers() {
        const customersInformation = await getCustomers();
        const firstCustomer = customersInformation.customers.length > 0 ? customersInformation.customers[0] : { id: 0 };
        this.setState({
            currentCustomerID: firstCustomer.id,
            customers: customersInformation.customers,
            errorCustomers: customersInformation.errorMessage,
            isLoadingCustomers: false
        });
        this.loadCustomerTransactions(firstCustomer.id);
    }

    async loadCustomerTransactions(customerID) {
        let transactions = [];
        let remainingBalance = 0;
        if (!!customerID) {
            const transactionsInformation = await getCustomerTransactions(customerID);
            if (transactionsInformation.doesErrorExist) {
                this.setState({
                    errorTransactions: transactionsInformation.errorMessage,
                    isLoadingTransactions: false
                });
                return;
            }
            transactions = transactionsInformation.transactions;
            remainingBalance = transactionsInformation.remainingBalance;
        }
        this.setState({
            remainingBalance: remainingBalance.toFixed(2),
            transactions: transactions,
            isLoadingTransactions: false
        });
    }

    componentDidMount() {
        if (getAccess()) {
            loadingMessage("loading-customers-container", this.state.loadingMessageCustomers, this.state.loadingMessageCustomers);
            loadingMessage("loading-remaining-balance-container", this.state.loadingMessageRemainingBalance, this.state.loadingMessageRemainingBalance);
            loadingMessage("loading-transactions-container", this.state.loadingMessageTransactions, this.state.loadingMessageTransactions);
            this.loadCustomers();
        }
    };

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }

    render() {
        const changeCustomer = (value) => {
            const valueToInt = parseInt(value);
            this.loadCustomerTransactions(valueToInt);
            this.setState({
                currentCustomerID: parseInt(valueToInt)
            });
        }

        const showCustomerOptions = () => {
            let options = [];
            for (let i = 0; i < this.state.customer.length; i++) {
                const CurrentCustomer = this.state.customers[i];
                options.push(<option key={CurrentCustomer.id} value={CurrentCustomer.id}>{CurrentCustomer.name}</option>);
            }
            return options;
        }

        const showCustomerTransactions = () => {
            let transactions = [];
            if (this.state.transactions.length > 0) {
                transactions.push(
                    <React.Fragment>
                        <tr>
                            <th>{ENUSStrings.TypeLabel}</th>
                            <th>{ENUSStrings.AmountLabel}</th>
                            <th>{ENUSStrings.ViewTransactionLabel}</th>
                        </tr>
                    </React.Fragment>
                );
            }
            for (let i = 0; i < this.state.transactions.length; i++) {
                const CurrentTransaction = this.state.transactions[i];
                if (CurrentTransaction.type === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE) {
                    transactions.push(
                        <React.Fragment>
                            <tr className="invoice-row">
                                <td>{CurrentTransaction.type}</td>
                                <td>{CurrentTransaction.total}</td>
                                <td>
                                    <a
                                        href={`/transaction?id=${CurrentTransaction.id}&type=invoice&customerID=${this.state.currentCustomerID}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {ENUSStrings.ViewTransactionLabel}
                                    </a>
                                </td>
                            </tr>
                        </React.Fragment>
                    );
                }
                else {
                    transactions.push(
                        <React.Fragment>
                            <tr className="payment-row">
                                <td>{CurrentTransaction.type}</td>
                                <td>{CurrentTransaction.total}</td>
                                <td>
                                    <a
                                        href={`/transaction?id=${CurrentTransaction.id}&type=payment&customerID=${this.state.currentCustomerID}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {ENUSStrings.ViewTransactionLabel}
                                    </a>
                                </td>
                            </tr>
                        </React.Fragment>
                    );
                }
            }
            return transactions;
        }

        const showRemainingBalance = () => {
                return `$${this.state.remainingBalance}`;
        }

        return (
            <div className="customer-container">
                <div className="customer-top-container">
                    <div className="customer-dropdown-container">
                        <div id="loading-customers-container" hidden={!this.state.isLoadingCustomers}>
                            <span>{this.state.loadingMessageCustomers}</span>
                        </div>
                        <div hidden={!this.state.errorCustomers}>
                            <span>{this.state.errorCustomers}</span>
                        </div>
                        {!this.state.errorCustomers && !this.state.isLoadingCustomers &&
                            <React.Fragment>
                                <span>{ENUSStrings.ChooseCustomerLabel}</span>
                                <select
                                    id="customer-dropdown"
                                    onChange={(control) => changeCustomer(control.target.value)}
                                    title={ENUSStrings.ChooseCustomerLabel}
                                >
                                    {showCustomerOptions()}
                                </select>
                            </React.Fragment>
                        }
                    </div>
                    <div className="customer-info-container" hidden={!!this.state.errorCustomers}>
                        <div className="remaining-balance-container">
                            <div id="loading-remaining-balance-container" hidden={!this.state.isLoadingTransactions}>
                                <span>{this.state.loadingMessageRemainingBalance}</span>
                            </div>
                            <div hidden={!this.state.errorRemainingBalance}>
                                <span>{this.state.errorRemainingBalance}</span>
                            </div>
                            {!this.state.errorRemainingBalance && !this.state.isLoadingTransactions &&
                                <React.Fragment>
                                    <span>{ENUSStrings.RemainingTransactonLabel}</span>
                                    <span className="remaining-balance">{showRemainingBalance()}</span>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
                <div className="transactions-container" hidden={!!this.state.errorCustomers}>
                    <div className="transactions-actions-container">
                        <div className="transactions-actions" hidden={this.state.isLoadingCustomers}>
                            <span>
                                <a href={`/transaction?type=invoice&customerID=${this.state.currentCustomerID}`}>{ENUSStrings.MakeInvoiceLabel}</a>
                            </span>
                            <span>
                                <a href={`/transaction?type=payment&customerID=${this.state.currentCustomerID}`}>{ENUSStrings.MakePaymentLabel}</a>
                            </span>
                        </div>
                    </div>
                    <div className="transactions-info-container">
                        <div id="loading-transactions-container" hidden={!this.state.isLoadingTransactions}>
                            <span>{this.state.loadingMessageTransactions}</span>
                        </div>
                        <div hidden={!this.state.errorTransactions}>
                            <span>{this.state.errorTransactions}</span>
                        </div>
                        {!this.state.errorTransactions && !this.state.isLoadingTransactions &&
                            <table className="transactions-table">
                                {showCustomerTransactions()}
                            </table>
                        }
                    </div>
                </div>
            </div>
        );
    };
}
