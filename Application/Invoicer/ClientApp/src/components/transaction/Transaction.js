import React, { Component } from "react";
import SETTINGS from "../../AppSettings";
import "./Transaction.css";
import getCompanies from "../../services/GetCompanies";
import checkQueryParameter from "../../utilities/CheckQueryParameter";
import changeQueryParameter from "../../utilities/ChangeQueryParameter";
import loadingMessage from "../../utilities/LoadingMessage";
import ENUSStrings from "../../strings/ENUSStrings";
import transactionFormValidation from "../../utilities/validation/TransactionFormValidation";

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
            errorCompanies: "",
            paymentDate: null,
            dueDate: null,
            checkNumber: "",
            total: "",
            dueDateError: "",
            paymentDateError: "",
            checkNumberError: "",
            totalError: "",
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
        const changeCompany = (value) => {
            this.setState({
                currentCompanyID: value
            });
            changeQueryParameter(SETTINGS.COMPANY_ID_QUERY_PARAMETER, value);
        };

        const submissionItem = {
            type: this.state.currentType,
            createdDate: new Date(),
            dueDate: this.state.dueDate,
            checkNumber: this.state.checkNumberError,
            total: this.state.total,
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

        const changeValue = (value, id) => {
            this.setState({
                [id]: value
            });
        };

        const validateSimpleText = (value, labelText, errorProperty) => {
            if (this.state.isSubmissionAttempted) {
                if (!!value) {
                    this.setState({ [errorProperty]: "" });
                }
                else {
                    this.setState({ [errorProperty]: labelText + ENUSStrings.BlankErrorMessage });
                }
            }
        }

        const createTransactionOnClick = (event) => {
            event.preventDefault();
            const validation = transactionFormValidation(submissionItem);
            this.setState({
                dueDateError: validation.errors.dueDateError,
                paymentDateError: validation.errors.paymentDateError,
                checkNumberError: validation.errors.checkNumberError,
                totalError: validation.errors.totalError,
                isSubmissionAttempted: true
            });
            if (validation.isValid) {

            }
        };

        return (
            <div className="transaction-container">
                <div className="transaction-company-dropdown-container">
                    <div id="loading-companies-container" hidden={!this.state.isLoadingCompanies}>
                        <span>{this.state.loadingMessageCompanies}</span>
                    </div>
                    <div hidden={!this.state.errorCompanies}>
                        <span>{this.state.errorCompanies}</span>
                    </div>
                    {!this.state.errorCompanies && !this.state.isLoadingCompanies &&
                        <div className="field-container">
                            <span className="field-label">{ENUSStrings.ChooseCompanyLabel}</span>
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
                            <form onSubmit={createTransactionOnClick}>
                                <table className="transaction-information-table">
                                    <tr className="field-container">
                                        <td>
                                            <span className="field-label">{ENUSStrings.ChooseTypeLabel}</span>
                                        </td>
                                        <td>
                                            <select id="type-dropdown" onChange={(control) => changeType(control.target.value)} value={this.state.currentType}>
                                                <option value="invoice">{ENUSStrings.InvoiceLabel}</option>
                                                <option value="payment">{ENUSStrings.PaymentLabel}</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="field-container">
                                        <td>
                                            <span className="field-label">{this.state.currentType !== "invoice" ? ENUSStrings.PaymentDateLabel : ENUSStrings.DueDateLabel}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <input
                                                    type="date"
                                                    id="due-payment-date"
                                                    name="due-date"
                                                    onChange={(control) => {
                                                        changeValue(control.target.value, control.target.id);

                                                    }}
                                                />
                                            </span>
                                            <span className="field-error">{this.state.currentType !== "invoice" ? this.state.paymentDateError : this.state.dueDateError}</span>
                                        </td>
                                        <td hidden={this.state.currentType !== "invoice" ? (!this.state.paymentDateError || !this.state.isSubmissionAttempted) : (!this.state.dueDateError || !this.state.isSubmissionAttempted)}>
                                        </td>
                                    </tr>
                                    <tr className="field-container" hidden={this.state.currentType !== "payment"}>
                                        <td>
                                            <span className="field-label">{ENUSStrings.CheckNumberLabel}</span>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                id="check-number"
                                                name="check-number"
                                                onChange={(control) => {
                                                    changeValue(control.target.value, control.target.id);
                                                    validateSimpleText(control.target.value, ENUSStrings.CheckNumberLabel, "checkNumberError")
                                                }}
                                            />
                                        </td>
                                        <td hidden={!this.state.checkNumberError || !this.state.isSubmissionAttempted}>
                                            <span className="field-error">{this.state.checkNumberError}</span>
                                        </td>
                                    </tr>
                                    <tr className="field-container">
                                        <td>
                                            <span className="field-label">{ENUSStrings.TotalLabel}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <input
                                                    type="text"
                                                    id="total"
                                                    name="total"
                                                    onChange={(control) => {
                                                        changeValue(control.target.value, control.target.id)
                                                    }}
                                                />
                                            </span>
                                        </td>
                                        <td hidden={!this.state.totalError || !this.state.isSubmissionAttempted}>
                                            <span className="field-error">{this.state.totalError}</span>
                                        </td>
                                    </tr>
                                </table>
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