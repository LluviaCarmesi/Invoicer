import React, { Component } from 'react';
import loadingMessage from "../../utilities/LoadingMessage";
import getCustomers from "../../services/GetCustomers";
import getCustomerTransactions from "../../services/GetCustomerTransactions";
import "./Home.css";
import ENUSStrings from '../../strings/ENUSStrings';
import SETTINGS from '../../AppSettings';
import getCompanies from '../../services/GetCompanies';
import getCompanyCustomers from '../../services/GetCompanyCustomers';
import createHTMLOptions from '../../utilities/CreateHTMLOptions';

async function getAccess() {
    await (() => { return true; });
};

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            currentCompanyID: 0,
            currentCustomerID: 0,
            companies: [],
            customers: [],
            transactions: [],
            remainingBalance: 0.00,
            errorCompanies: "",
            errorCustomers: "",
            errorRemainingBalance: "",
            errorTransactions: "",
            loadingCompaniesMessage: ENUSStrings.LoadingCompaniesLabel,
            loadingCustomersMessage: ENUSStrings.LoadingCustomersLabel,
            loadingRemainingBalanceMessage: ENUSStrings.LoadingRemainingBalanceLabel,
            loadingTransactionsMessage: ENUSStrings.LoadingTransactionsLabel,
            isLoadingCompanies: true,
            isLoadingCustomers: true,
            isLoadingTransactions: true
        };
    }

    async loadCompanies() {
        const companiesInformation = await getCompanies();
        if (companiesInformation.doesErrorExist) {
            this.setState({
                errorCompanies: companiesInformation.errorMessage,
                isLoadingCompanies: false,
                isLoadingCustomers: false,
                isLoadingTransactions: false
            });
            return;
        }
        const firstCompany = companiesInformation.companies[0];
        this.setState({
            companies: companiesInformation.companies,
            currentCompanyID: firstCompany,
            isLoadingCompanies: false,
        });
        this.loadCompanyCustomers(firstCompany);
    }

    async loadCompanyCustomers(companyID) {
        const customersInformation = await getCompanyCustomers(companyID);
        if (customersInformation.doesErrorExist) {
            this.setState({
                errorCustomers: customersInformation.errorMessage,
                isLoadingCustomers: false,
                isLoadingTransactions: false
            });
            return;
        }
        const firstCustomer = customersInformation.customers[0];
        this.setState({
            currentCustomerID: firstCustomer.id,
            customers: customersInformation.customers,
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
            loadingMessage("loading-companies-container", this.state.loadingCompaniesMessage, this.state.loadingCompaniesMessage);
            loadingMessage("loading-customers-container", this.state.loadingCustomersMessage, this.state.loadingCustomersMessage);
            loadingMessage("loading-remaining-balance-container", this.state.loadingRemainingBalanceMessage, this.state.loadingRemainingBalanceMessage);
            loadingMessage("loading-transactions-container", this.state.loadingTransactionsMessage, this.state.loadingTransactionsMessage);
            this.loadCompanies();
        }
    };

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }

    render() {
        const changeCompany = (value) => {
            const valueToInt = parseInt(value);
            this.loadCompanyCustomers(valueToInt);
            this.setState({
                currentCompanyID: parseInt(valueToInt)
            });
        }

        const changeCustomer = (value) => {
            const valueToInt = parseInt(value);
            this.loadCustomerTransactions(valueToInt);
            this.setState({
                currentCustomerID: parseInt(valueToInt)
            });
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
            <div>
                <div className="company-container">
                    <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                        <span>{this.state.loadingCompaniesMessage}</span>
                    </div>
                    <div hidden={!this.state.errorCompanies}>
                        <span>{this.state.errorCompanies}</span>
                    </div>
                    <div className="company-dropdown-container">
                        {!this.state.errorCompanies && !this.state.isLoadingCompanies &&
                            <React.Fragment>
                                <span>{ENUSStrings.ChooseCompanyLabel}</span>
                                <select
                                    id="company-dropdown"
                                    onChange={(control) => changeCompany(control.target.value)}
                                    title={ENUSStrings.ChooseCompanyLabel}
                                >
                                    {createHTMLOptions(this.state.companies)}
                                </select>
                            </React.Fragment>
                        }
                    </div>
                </div>
                <div className="customer-container">
                    <div className="customer-top-container">
                        <div className="customer-dropdown-container" hidden={!!this.state.errorCompanies}>
                            <div id="loading-customers-container" hidden={!this.state.isLoadingCustomers}>
                                <span>{this.state.loadingCustomersMessage}</span>
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
                                        {createHTMLOptions(this.state.customers)}
                                    </select>
                                </React.Fragment>
                            }
                        </div>
                        <div className="customer-info-container" hidden={!!this.state.errorCustomers || this.state.errorCompanies}>
                            <div className="remaining-balance-container">
                                <div id="loading-remaining-balance-container" hidden={!this.state.isLoadingTransactions}>
                                    <span>{this.state.loadingRemainingBalanceMessage}</span>
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
                    <div className="transactions-container" hidden={!!this.state.errorCustomers || this.state.errorCompanies}>
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
                                <span>{this.state.loadingTransactionsMessage}</span>
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
            </div>
        );
    };
}
