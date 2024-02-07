import React, { Component } from "react";
import addCompany from "../../services/AddCompany";
import getCompanies from "../../services/GetCompanies";
import companyFormValidation from "../../utilities/validation/CompanyFormValidation";

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
        const submissionItem = {
            name: this.state.name,
            address: this.state.address,
            city: this.state.city,
            country: this.state.country,
            zip: this.state.zip
        };

        const changeCompany= (value) => {
            const valueToInt = parseInt(value);
            const company = this.state.companies.filter((company) => company.id === valueToInt)[0];
            this.setState({
                currentCompanyID: valueToInt,
                name: company.name,
                address: company.address,
                city: company.city,
                country: company.country,
                zip: company.zip
            });
        };

        const changeValue = (value, id) => {
            this.setState({
                [id]: value
            });
        };

        const closeSuccessFailureMessage = () => {
            this.setState({
                isSuccessFailureMessageClosed: true
            });
        }

        const validateForm = (isSubmissionAttempted) => {
            const validation = companyFormValidation(submissionItem);
            if (isSubmissionAttempted) {
                this.setState({
                    nameError: validation.errors.nameError,
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                    isSubmissionAttempted: true
                });
            }
            else {
                this.setState({
                    nameError: validation.errors.nameError,
                    addressError: validation.errors.addressError,
                    cityError: validation.errors.cityError,
                    countryError: validation.errors.countryError,
                    zipError: validation.errors.zipError,
                });
            }
            return validation.isValid;
        }

        const submitCustomerOnClick = async (event) => {
            event.preventDefault();
            let currentInformation = submissionItem;
            let isSuccessful = false;
            let errorMessage = "";
            if (validateForm(true)) {
                this.setState({
                    isSubmissionButtonClicked: true,
                    isSuccessFailureMessageClosed: true
                });
                if (!this.state.currentCompanyID) {
                    const companyAddition = await addCompany(currentInformation);
                    isSuccessful = !companyAddition.doesErrorExist;
                    errorMessage = companyAddition.errorMessage;
                    if (isSuccessful) {
                        currentInformation.name = "";
                        currentInformation.address = "";
                        currentInformation.city = "";
                        currentInformation.country = "";
                        currentInformation.zip = "";
                    }
                }
                else {
                    const companyEdit= await editCompany(currentInformation, this.state.currentCustomerID);
                    isSuccessful = !companyEdit.doesErrorExist;
                    errorMessage = companyEdit.errorMessage;
                }
                this.setState({
                    name: currentInformation.name,
                    address: currentInformation.address,
                    city: currentInformation.city,
                    country: currentInformation.country,
                    zip: currentInformation.zip,
                    wasSubmissionSuccessful: isSuccessful,
                    wasSubmissionFailure: !isSuccessful,
                    submissionErrorMessage: errorMessage,
                    isSuccessFailureMessageClosed: false,
                    isSubmissionButtonClicked: false
                });
            }
        };

        return (
            <div></div>
        );
    }
}