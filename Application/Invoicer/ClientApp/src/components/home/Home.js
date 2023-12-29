import React, { Component } from 'react';
import loadingMessage from "../../utilities/LoadingMessage";
import getCompanies from "../../services/GetCompanies";
import getCompanyTransactions from "../../services/GetCompanyTransactions";
import getRemainingBalance from "../../services/GetRemainingBalance";
import "./Home.css";

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
            remainingBalance: 0,
            errorCompanies: "",
            errorRemainingBalance: "",
            errorTransactions: "",
            loadingMessageCompanies: "Loading Companies",
            loadingMessageRemainingBalance: "Loading Balance",
            loadingMessageTransactions: "Loading Transactions",
            isLoadingCompanies: true,
            isLoadingRemainingBalance: true,
            isLoadingTransactions: true
        };
    }

    async loadCompanies() {
        const companyInformation = await getCompanies();
        const firstCompany = companyInformation.companies.length > 0 ? companyInformation.companies[0] : { id: 0 };
        this.setState({
            currentCompanyID: firstCompany.id,
            companies: companyInformation.companies,
            errorCompanies: companyInformation.error,
            isLoadingCompanies: false
        });
        this.loadCompanyTransactions(firstCompany.id);
        this.loadRemainingBalance(firstCompany.id);
    }

    async loadCompanyTransactions(companyID) {
        const transactionInformation = await getCompanyTransactions(companyID);
        this.setState({
            transactions: transactionInformation.transactions,
            errorTransactions: transactionInformation.error,
            isLoadingTransactions: false
        });
    }

    async loadRemainingBalance(companyID) {
        const remainingBalanceInformation = await getRemainingBalance(companyID);
        this.setState({
            remainingBalance: remainingBalanceInformation.balance,
            errorRemainingBalance: remainingBalanceInformation.error,
            isLoadingRemainingBalance: false
        })
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
            this.loadCompanyTransactions(value);
            this.setState({
                currentCompanyID: value
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
                            <th>type</th>
                            <th>amount</th>
                        </tr>
                    </React.Fragment>
                );
            }
            for (let i = 0; i < this.state.transactions.length; i++) {
                const CurrentTransaction = this.state.transactions[i];
                transactions.push(
                    <React.Fragment>
                        <tr>
                            <td>{CurrentTransaction.type}</td>
                            <td>{CurrentTransaction.amount}</td>
                        </tr>
                    </React.Fragment>
                );
            }
            return transactions;
        }

        const showRemainingBalance = () => {
            if (this.state.remainingBalance < 0) {
                return `-$${this.state.remainingBalance}`;
            }
            else {
                return `$${this.state.remainingBalance}`;
            }
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
                            <select id="company-dropdown" onChange={(control) => changeCompany(control.target.value)}>
                                {showCompanyOptions()}
                            </select>
                        }
                    </div>
                    <div className="company-info-container" hidden={!!this.state.errorCompanies}>
                        <div className="remaining-balance-container">
                            <div id="loading-remaining-balance-container" hidden={!this.state.isLoadingRemainingBalance}>
                                <span>{this.state.loadingMessageRemainingBalance}</span>
                            </div>
                            <div hidden={!this.state.errorRemainingBalance}>
                                <span>{this.state.errorRemainingBalance}</span>
                            </div>
                            {!this.state.errorRemainingBalance && !this.state.isLoadingRemainingBalance &&
                                <React.Fragment>
                                    <span>Remaining Balance</span>
                                    <span className="remaining-balance">{showRemainingBalance()}</span>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
                <div className="transactions-container" hidden={!!this.state.errorCompanies}>
                    <div className="transactions-actions-container">
                        <div className="transactions-actions">
                            <span>
                                <a href={`/transaction?type=invoice&companyID=${this.state.currentCompanyID}`}>Make Invoice</a>
                            </span>
                            <span>
                                <a href={`/transaction?type=payment&companyID=${this.state.currentCompanyID}`}>Make Payment</a>
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
