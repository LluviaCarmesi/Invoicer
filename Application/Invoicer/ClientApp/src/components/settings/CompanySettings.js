import React, { Component } from "react";
import getCompanies from "../../services/GetCompanies";

export default class CompanySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            currentType: "",
            currentCompanyID: 0,
            name: "",
            address: "",
            city: "",
            country: "",
            zip: "",
            nameError: "",
            addressError: "",
            cityError: "",
            countryError: "",
            zipError: "",
            isLoadingCompanies: true,
            errorCompanies: "",
            loadingMessageCompanies: ENUSStrings.LoadingCompaniesLabel,
            isSubmissionAttempted: false,
            wasSubmissionFailure: false,
            wasSubmissionSuccessful: false,
            submissionErrorMessage: "",
            isSuccessFailureMessageClosed: true,
            isSubmissionButtonClicked: false
        };
    }

    async loadCompanies() {
        let currentCompanyInformation = {
            id: 0,
            name: "",
            address: "",
            city: "",
            country: "",
            zip: "",
        }
        const companiesInformation = await getCompanies();
        if (companiesInformation.doesErrorExist) {
            this.setState({
                errorCustomers: companiesInformation.errorMessage,
                isLoadingCompanies: false
            });
            return;
        }
        const currentCompany = companiesInformation.companies.length > 0 ? companiesInformation.companies[0] : { id: 0 };
        if (!!currentCompany.id) {
            currentCompanyInformation.id = currentCompany.id;
            currentCompanyInformation.name = currentCompany.name;
            currentCompanyInformation.phone = currentCompany.phone;
            currentCompanyInformation.email = currentCompany.email;
            currentCompanyInformation.address = currentCompany.address;
            currentCompanyInformation.city = currentCompany.city;
            currentCompanyInformation.country = currentCompany.country;
            currentCompanyInformation.zip = currentCompany.zip;
            currentCompanyInformation.isActive = currentCompany.isActive;
        }
        this.setState({
            currentCompanyID: currentCompanyInformation.id,
            customer: companiesInformation.companies,
            name: currentCompanyInformation.name,
            phone: currentCompanyInformation.phone,
            email: currentCompanyInformation.email,
            address: currentCompanyInformation.address,
            city: currentCompanyInformation.city,
            country: currentCompanyInformation.country,
            zip: currentCompanyInformation.zip,
            isActive: currentCompanyInformation.isActive,
            isLoadingCompanies: false
        });
    }

    componentDidMount() {
        const { type } = this.props;
        this.setState({
            currentType: type
        });
        if (type === SETTINGS.NEW_EDIT_CHOICES.EDIT) {
            loadingMessage("loading-companies-container", this.state.loadingMessageCompanies, this.state.loadingMessageCompanies);
            this.loadCompanies();
        }
        else {
            this.setState({
                isLoadingCompanies: false,
            });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        console.log(previousState);
        console.log(this.state);
    }
    render() {

        return (
            <div></div>
        );
    }
}