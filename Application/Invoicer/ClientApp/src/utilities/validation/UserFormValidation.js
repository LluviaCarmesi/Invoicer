import ENUSStrings from "../../strings/ENUSStrings";
import SETTINGS from "../../AppSettings";
import doErrorsExist from "./DoErrorsExist";

export default function userFormValidation(values) {
    let isValid = true;
    let errors = {
        firstNameError: "",
        lastNameError: "",
        userEmailError: "",
        userPhoneError: "",
        usernameError: "",
        passwordError: "",
        confirmPasswordError: ""
    };

    if (!values.firstName) {
        errors.firstNameError = ENUSStrings.FirstNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.lastName) {
        errors.lastNameError = ENUSStrings.LastNameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.userEmail) {
        errors.userEmailError = ENUSStrings.UserEmailLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!values.userEmail.match(SETTINGS.EMAIL_REG_EXPRESSION)) {
        errors.userEmailError = ENUSStrings.UserEmailLabel + ENUSStrings.EmailFormatErrorMessage;
    }
    if (!values.userPhone) {
        errors.userPhoneError = ENUSStrings.UserPhoneLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!values.userPhone.match(SETTINGS.PHONE_REG_EXPRESSION)) {
        errors.userPhoneError = ENUSStrings.UserPhoneLabel + ENUSStrings.PhoneFormatErrorMessage;
    }
    if (!values.username) {
        errors.usernameError = ENUSStrings.UsernameLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.password) {
        errors.passwordError = ENUSStrings.PasswordLabel + ENUSStrings.BlankErrorMessage;
    }
    if (!values.confirmPassword) {
        errors.confirmPasswordError = ENUSStrings.ConfirmPasswordLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!(values.password === values.confirmPassword)) {
        errors.confirmPasswordError = ENUSStrings.PasswordNotMatchingLabel;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}