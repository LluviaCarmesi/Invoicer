import SETTINGS from "../../AppSettings";
import ENUSStrings from "../../strings/ENUSStrings";
import doErrorsExist from "./DoErrorsExist";

export default function customerFormValidation(values) {
    let isValid = true;
    let errors = {
        companyIDError: "",
        nameError: "",
        phoneError: "",
        emailError: "",
        addressError: "",
        cityError: "",
        stateError: "",
        countryError: "",
        zipError: "",
    };
    if (!values.companyID) {
        errors.companyIDError = ENUSStrings.CompanyNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.name) {
        errors.nameError = ENUSStrings.CustomerNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.phone) {
        errors.phoneError = ENUSStrings.CustomerPhoneLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!values.phone.match(SETTINGS.PHONE_REG_EXPRESSION)) {
        errors.phoneError = ENUSStrings.CustomerPhoneLabel + ENUSStrings.PhoneFormatErrorMessage;
    }
    if (!values.email) { }
    else if (!values.email.match(SETTINGS.EMAIL_REG_EXPRESSION)) {
        errors.emailError = ENUSStrings.CustomerEmailLabel + ENUSStrings.EmailFormatErrorMessage
    }
    if (!values.address) {
        errors.addressError = ENUSStrings.CustomerAddressLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.city) {
        errors.cityError = ENUSStrings.CustomerCityLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.state) {
        errors.stateError = ENUSStrings.CustomerStateLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.country) {
        errors.countryError = ENUSStrings.CustomerCountryLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.zip) {
        errors.zipError = ENUSStrings.CustomerZipLabel + ENUSStrings.BlankErrorMessage;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}