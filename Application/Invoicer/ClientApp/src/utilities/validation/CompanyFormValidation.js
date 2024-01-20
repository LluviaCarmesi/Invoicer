import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import doErrorsExist from "./DoErrorsExist";

export default function companyFormValidation(values) {
    let isValid = true;
    let errors = {
        nameError: "",
        phoneError: "",
        emailError: "",
        addressError: "",
        cityError: "",
        countryError: "",
        zipError: "",
    };
    if (!values.name) {
        errors.nameError = ENUSStrings.CompanyNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.phone) {
        errors.phoneError = ENUSStrings.CompanyPhoneLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!values.phone.match(SETTINGS.PHONE_REG_EXPRESSION)) {
        errors.phoneError = ENUSStrings.CompanyPhoneLabel + ENUSStrings.PhoneFormatErrorMessage;
    }
    if (!values.email) { }
    else if (!values.email.match(SETTINGS.EMAIL_REG_EXPRESSION)) {
        errors.emailError = ENUSStrings.CompanyEmailLabel + ENUSStrings.EmailFormatErrorMessage
    }
    if (!values.address) {
        errors.addressError = ENUSStrings.CompanyAddressLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.city) {
        errors.cityError = ENUSStrings.CompanyCityLabel + ENUSStrings.BlankErrorMessage;
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