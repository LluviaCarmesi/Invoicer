import ENUSStrings from "../../strings/ENUSStrings"
import isValueNumber from "./IsValueNumber";
import doErrorsExist from "./CompanyFormValidation";
import SETTINGS from "../../AppSettings";

export default function transactionFormValidation(values) {
    let isValid = true;
    let errors = {
        dueDateError: "",
        paymentDateError: "",
        checkNumberError: "",
        totalError: "",
    };
    if (values.type === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE) {
        if (!values.dueDate) {
            errors.dueDateError = ENUSStrings.DueDateLabel + ENUSStrings.BlankErrorMessage;
        }
    }
    else {
        if (!values.checkNumber) {
            errors.checkNumberError = ENUSStrings.CheckNumberLabel + ENUSStrings.BlankErrorMessage;
        }
        if (!values.paymentDate) {
            errors.paymentDateError = ENUSStrings.PaymentDateLabel + ENUSStrings.BlankErrorMessage;
        }
    }

    if (!values.total) {
        errors.totalError = ENUSStrings.TotalLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!isValueNumber(values.total)) {
        errors.totalError = ENUSStrings.TotalLabel + ENUSStrings.NumberErrorMessage;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}