import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import doErrorsExist from "./DoErrorsExist";

export default function companyFormValidation(values) {
    let isValid = true;
    let errors = {
        companyNameError: "",
        companyPhoneError: "",
        companyEmailError: "",
        companyAddressError: "",
        companyCityError: "",
        companyCountryError: "",
        companyZipError: "",
    };
    if (!values.companyName) {
        errors.companyNameError = ENUSStrings.CompanyNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.companyPhone) {
        errors.companyPhoneError = ENUSStrings.CompanyPhoneLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!values.companyPhone.match(SETTINGS.PHONE_REG_EXPRESSION)) {
        errors.companyPhoneError = ENUSStrings.CompanyPhoneLabel + ENUSStrings.PhoneFormatErrorMessage;
    }
    if (!values.companyEmail) { }
    else if (!values.companyEmail.match(SETTINGS.EMAIL_REG_EXPRESSION)) {
        errors.companyEmailError = ENUSStrings.CompanyEmailLabel + ENUSStrings.EmailFormatErrorMessage
    }
    if (!values.companyAddress) {
        errors.companyAddressError = ENUSStrings.CompanyAddressLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.companyCity) {
        errors.companyCityError = ENUSStrings.CompanyCityLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.companyCountry) {
        errors.companyCountryError = ENUSStrings.CompanyCountryLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.companyZip) {
        errors.companyZipError = ENUSStrings.CompanyZipLabel + ENUSStrings.BlankErrorMessage;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}