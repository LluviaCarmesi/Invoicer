import React, { Component } from 'react';
import SETTINGS from '../../AppSettings';
import "./Transaction.css";
import getCompanies from "../../services/GetCompanies";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import changeQueryParameter from "../../utilities/ChangeQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";

export default class Transaction extends Component {
    constructor(props) {
        super(props);
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
            errorCompanies: ""
        };
    }

    async loadTransaction(transactionID) {

    }

    async loadCompanies(transactionID) {
        const companyInformation = await getCompanies();
        const firstCompany = companyInformation.companies.length > 0 ? companyInformation.companies[0] : {id: 0, name: ""};
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

        const changeType = (value) => {
            this.setState({ currentType: value })
            changeQueryParameter(SETTINGS.TYPE_QUERY_PARAMETER, value);
        };

        const showCompanyOptions = () => {
            let options = [];
            for (let i = 0; i < this.state.companies.length; i++) {
                const CurrentCompany = this.state.companies[i];
                options.push(<option key={CurrentCompany.id} value={CurrentCompany.id}>{CurrentCompany.name}</option>);
            }
            return options;
        }

        return (
            <div className="main-container">
                <div className="company-dropdown-container">
                    <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                        <span>{this.state.loadingMessageCompanies}</span>
                    </div>
                    <div hidden={!this.state.errorCompanies}>
                        <span>{this.state.errorCompanies}</span>
                    </div>
                    {!this.state.errorCompanies && !this.state.isLoadingCompanies &&
                        <div className="field-container">
                            <span className="field-label">Choose a Company</span>
                            <select id="company-dropdown" onChange={(control) => changeCompany(control.target.value)} value={this.state.currentCompanyID}>
                                {showCompanyOptions()}
                            </select>
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
                            <div className="field-container">
                                <span className="field-label">Choose Type</span>
                                <select id="type-dropdown" onChange={(control) => changeType(control.target.value)} value={this.state.currentType}>
                                    <option value="invoice">Invoice</option>
                                    <option value="payment">Payment</option>
                                </select>
                            </div>
                            <div className="field-container">
                                <span className="field-label">{this.state.currentType !== "invoice" ? "Payment Date" : "Due Date"}</span>
                                <span>
                                    <input type="date" id="due-payment-date" name="due-date" />
                                </span>
                            </div>
                            <div className="field-container" hidden={this.state.currentType !== "payment"}>
                                <span className="field-label">Check Number</span>
                                <input type="text" id="check-number" name="check-number" />
                            </div>
                            <div className="field-container">
                                <span className="field-label">Total</span>
                                <span>
                                    $<input type="text" id="total" name="total" />
                                </span>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}