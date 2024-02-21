import React, { Component } from 'react';
import loadingMessage from "../../utilities/LoadingMessage";
import getCustomerTransactions from "../../services/GetCustomerTransactions";
import "./Home.css";
import ENUSStrings from '../../strings/ENUSStrings';
import SETTINGS from '../../AppSettings';
import getCompanies from '../../services/GetCompanies';
import getCompanyCustomers from '../../services/GetCompanyCustomers';
import createHTMLOptions from '../../utilities/CreateHTMLOptions';
import setCookie from "../../utilities/SetCookie";
import getCookie from '../../utilities/GetCookie';
import getCustomers from '../../services/GetCustomers';

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
        const companiesReturned = companiesInformation.companies;
        const currentCompanyCookie = getCookie(SETTINGS.COOKIE_KEYS.CURRENT_COMPANY);
        const filteredCompanyWithCookie = !!currentCompanyCookie && companiesReturned.length > 0 ? companiesReturned.filter(company => company.id === parseInt(currentCompanyCookie)) : [];
        const firstCompany = filteredCompanyWithCookie.length === 1 ? filteredCompanyWithCookie[0] : companiesReturned[0];
        setCookie(SETTINGS.COOKIE_KEYS.CURRENT_COMPANY, firstCompany.id);
        this.setState({
            companies: companiesReturned,
            currentCompanyID: firstCompany.id,
            isLoadingCompanies: false,
        });
        this.loadCompanyCustomers(firstCompany.id);
    }

    async loadAllCustomers(companies) {
        let currentCustomerID = 0;

        const customersInformation = await getCustomers();
        if (customersInformation.doesErrorExist) {
            this.setState({
                errorCustomers: customersInformation.errorMessage,
                isLoadingCustomers: false
            });
            return;
        }
        const customersReturned = customersInformation.customers;
        const currentCustomerCookie = getCookie(SETTINGS.COOKIE_KEYS.CURRENT_CUSTOMER);
        const filteredCustomerWithCookie = !!currentCustomerCookie && customersReturned.length > 0 ? customersReturned.filter(customer => customer.id === parseInt(currentCustomerCookie)) : [];
        const currentCustomer = filteredCustomerWithCookie.length === 1 ? customersReturned[0].id : 0;
        if (!!currentCustomer.id) {
            currentCustomerID = currentCustomer
        }
        return currentCustomerID;
    }

    async loadCompanyCustomers(companyID) {
        const customersInformation = await getCompanyCustomers(companyID);
        if (customersInformation.doesErrorExist) {
            this.setState({
                errorCustomers: customersInformation.errorMessage,
                isLoadingCustomers: false,
                isLoadingTransactions: false,
            });
            return;
        }
        const firstCustomer = customersInformation.customers[0];
        this.setState({
            currentCustomerID: firstCustomer.id,
            customers: customersInformation.customers,
            errorCustomers: "",
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
            isLoadingTransactions: false,
            errorTransactions: ""
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
            setCookie(SETTINGS.COOKIE_KEYS.CURRENT_COMPANY, valueToInt);
            this.setState({
                currentCompanyID: parseInt(valueToInt)
            });
        }

        const changeCustomer = (value) => {
            const valueToInt = parseInt(value);
            this.loadCustomerTransactions(valueToInt);
            let allChosenCustomers = [{
                companyID: this.state.currentCompanyID,
                customerID: this.state.currentCustomerID
            }];
            let allChosenCustomersCookie = getCookie(SETTINGS.COOKIE_KEYS.ALL_CHOSEN_CUSTOMERS);
            if (!!allChosenCustomersCookie) {
                allChosenCustomers = JSON.parse(allChosenCustomersCookie).push(allChosenCustomers[0]);
            }
            setCookie(SETTINGS.COOKIE_KEYS.ALL_CHOSEN_CUSTOMERS, JSON.stringify(allChosenCustomers));
            this.setState({
                currentCustomerID: parseInt(valueToInt)
            });
        }

        const showCustomerTransactions = () => {
            let transactions = [];
            if (this.state.transactions.length > 0) {
                transactions.push(
                    <thead key="0">
                        <tr>
                            <th>{ENUSStrings.TypeLabel}</th>
                            <th>{ENUSStrings.AmountLabel}</th>
                            <th>{ENUSStrings.ViewTransactionLabel}</th>
                        </tr>
                    </thead>
                );
            }
            for (let i = 0; i < this.state.transactions.length; i++) {
                const CurrentTransaction = this.state.transactions[i];
                if (CurrentTransaction.type === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE) {
                    transactions.push(
                        <tbody key={i + 1}>
                            <tr className="invoice-row">
                                <td>{CurrentTransaction.type}</td>
                                <td>{CurrentTransaction.total}</td>
                                <td>
                                    <a
                                        href={`/transaction?id=${CurrentTransaction.id}&type=invoice&customerID=${this.state.currentCustomerID}`}
                                    >
                                        {ENUSStrings.ViewTransactionLabel}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    );
                }
                else {
                    transactions.push(
                        <tbody key={i + 1}>
                            <tr className="payment-row">
                                <td>{CurrentTransaction.type}</td>
                                <td>{CurrentTransaction.total}</td>
                                <td>
                                    <a
                                        href={`/transaction?id=${CurrentTransaction.id}&type=payment&customerID=${this.state.currentCustomerID}`}
                                    >
                                        {ENUSStrings.ViewTransactionLabel}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
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
                                    value={this.state.currentCompanyID}
                                >
                                    {createHTMLOptions(this.state.companies, "city")}
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
                                <div hidden={!this.state.errorTransactions}>
                                    <span>{ENUSStrings.NoRemainingBalanceErrorMessage}</span>
                                </div>
                                {!this.state.errorTransactions && !this.state.isLoadingTransactions &&
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
