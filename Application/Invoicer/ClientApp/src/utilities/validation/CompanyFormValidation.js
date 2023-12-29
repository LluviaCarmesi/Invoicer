import ENUSStrings from "../../strings/ENUSStrings";

export default function (fields) {
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

    const errorKeys = Object.keys(errors);
    for (let i = 0; i < errorKeys.length; i++) {
        if (!!errors[errorKeys[i]]) {
            isValid = false;
            break;
        }
    }

    return { isValid, errors };
}