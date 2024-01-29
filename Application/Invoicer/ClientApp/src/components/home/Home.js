import React, { Component } from 'react';
import loadingMessage from "../../utilities/LoadingMessage";
import getCompanies from "../../services/GetCompanies";
import getCompanyTransactions from "../../services/GetCompanyTransactions";
import getRemainingBalance from "../../services/GetRemainingBalance";
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
            currentCompanyID: 0,
            companies: [],
            transactions: [],
            remainingBalance: 0.00,
            errorCompanies: "",
            errorRemainingBalance: "",
            errorTransactions: "",
            loadingMessageCompanies: ENUSStrings.LoadingCompaniesLabel,
            loadingMessageRemainingBalance: ENUSStrings.LoadingRemainingBalanceLabel,
            loadingMessageTransactions: ENUSStrings.LoadingTransactionsLabel,
            isLoadingCompanies: true,
            isLoadingTransactions: true
        };
    }

    async loadCompanies() {
        const companiesInformation = await getCompanies();
        const firstCompany = companiesInformation.companies.length > 0 ? companiesInformation.companies[0] : { id: 0 };
        this.setState({
            currentCompanyID: firstCompany.id,
            companies: companiesInformation.companies,
            errorCompanies: companiesInformation.errorMessage,
            isLoadingCompanies: false
        });
        this.loadCompanyTransactions(firstCompany.id);
    }

    async loadCompanyTransactions(companyID) {
        let transactions = [];
        let remainingBalance = 0;
        if (!!companyID) {
            const transactionsInformation = await getCompanyTransactions(companyID);
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
            loadingMessage("loading-companies-container", this.state.loadingMessageCompanies, this.state.loadingMessageCompanies);
            loadingMessage("loading-remaining-balance-container", this.state.loadingMessageRemainingBalance, this.state.loadingMessageRemainingBalance);
            loadingMessage("loading-transactions-container", this.state.loadingMessageTransactions, this.state.loadingMessageTransactions);
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
            this.loadCompanyTransactions(valueToInt);
            this.setState({
                currentCompanyID: parseInt(valueToInt)
            });
        }

        const showCompanyOptions = () => {
            let options = [];
            for (let i = 0; i < this.state.companies.length; i++) {
                const CurrentCompany = this.state.companies[i];
                options.push(<option key={CurrentCompany.id} value={CurrentCompany.id}>{CurrentCompany.name}</option>);
            }
            return options;
        }

        const showCompanyTransactions = () => {
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
                                        href={`/transaction?id=${CurrentTransaction.id}&type=invoice&companyID=${this.state.currentCompanyID}`}
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
                                        href={`/transaction?id=${CurrentTransaction.id}&type=payment&companyID=${this.state.currentCompanyID}`}
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
            <div className="company-container">
                <div className="company-top-container">
                    <div className="company-dropdown-container">
                        <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                            <span>{this.state.loadingMessageCompanies}</span>
                        </div>
                        <div hidden={!this.state.errorCompanies}>
                            <span>{this.state.errorCompanies}</span>
                        </div>
                        {!this.state.errorCompanies && !this.state.isLoadingCompanies &&
                            <React.Fragment>
                                <span>{ENUSStrings.ChooseCompanyLabel}</span>
                                <select
                                    id="company-dropdown"
                                    onChange={(control) => changeCompany(control.target.value)}
                                    title={ENUSStrings.ChooseCompanyLabel}
                                >
                                    {showCompanyOptions()}
                                </select>
                            </React.Fragment>
                        }
                    </div>
                    <div className="company-info-container" hidden={!!this.state.errorCompanies}>
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
                <div className="transactions-container" hidden={!!this.state.errorCompanies}>
                    <div className="transactions-actions-container">
                        <div className="transactions-actions" hidden={this.state.isLoadingCompanies}>
                            <span>
                                <a href={`/transaction?type=invoice&companyID=${this.state.currentCompanyID}`}>{ENUSStrings.MakeInvoiceLabel}</a>
                            </span>
                            <span>
                                <a href={`/transaction?type=payment&companyID=${this.state.currentCompanyID}`}>{ENUSStrings.MakePaymentLabel}</a>
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
                                {showCompanyTransactions()}
                            </table>
                        }
                    </div>
                </div>
            </div>
        );
    };
}
