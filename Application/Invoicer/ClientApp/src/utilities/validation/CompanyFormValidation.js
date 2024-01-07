import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import doErrorsExist from "./DoErrorsExist";

export default function companyFormValidation(fields) {
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
    if (!fields.companyName) {
        errors.companyNameError = ENUSStrings.CompanyNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!fields.companyPhone) {
        errors.companyPhoneError = ENUSStrings.CompanyPhoneLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!fields.companyPhone.match(SETTINGS.PHONE_REG_EXPRESSION)) {
        errors.companyPhoneError = ENUSStrings.CompanyPhoneLabel + ENUSStrings.PhoneFormatErrorMessage;
    }
    if (!fields.companyEmail) { }
    else if (!fields.companyEmail.match(SETTINGS.EMAIL_REG_EXPRESSION)) {
        errors.companyEmailError = ENUSStrings.CompanyEmailLabel + ENUSStrings.EmailFormatErrorMessage
    }
    if (!fields.companyAddress) {
        errors.companyAddressError = ENUSStrings.CompanyAddressLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!fields.companyCity) {
        errors.companyCityError = ENUSStrings.CompanyCityLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!fields.companyCountry) {
        errors.companyCountryError = ENUSStrings.CompanyCountryLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!fields.companyZip) {
        errors.companyZipError = ENUSStrings.CompanyZipLabel + ENUSStrings.BlankErrorMessage;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}