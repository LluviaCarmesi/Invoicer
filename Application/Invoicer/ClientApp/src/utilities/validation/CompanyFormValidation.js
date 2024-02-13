import ENUSStrings from "../../strings/ENUSStrings";
import doErrorsExist from "./DoErrorsExist";

export default function companyFormValidation(values) {
    let isValid = true;
    let errors = {
        nameError: "",
        addressError: "",
        cityError: "",
        stateError: "",
        countryError: "",
        zipError: "",
    };
    if (!values.name) {
        errors.nameError = ENUSStrings.CompanyNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.address) {
        errors.addressError = ENUSStrings.CompanyAddressLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.city) {
        errors.cityError = ENUSStrings.CompanyCityLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.state) {
        errors.stateError = ENUSStrings.CompanyStateLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.country) {
        errors.countryError = ENUSStrings.CompanyCountryLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.zip) {
        errors.zipError = ENUSStrings.CompanyZipLabel + ENUSStrings.BlankErrorMessage;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}