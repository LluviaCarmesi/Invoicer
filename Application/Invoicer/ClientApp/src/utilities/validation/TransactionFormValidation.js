import ENUSStrings from "../../strings/ENUSStrings"
import isValueNumber from "./IsValueNumber";
import doErrorsExist from "./CompanyFormValidation";
import SETTINGS from "../../AppSettings";

export default function transactionFormValidation(fields) {
    let isValid = true;
    let errors = {
        dueDateError: "",
        paymentDateError: "",
        checkNumberError: "",
        totalError: "",
    };
    if (fields.type === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE) {
        if (!fields.dueDate) {
            errors.dueDateError = ENUSStrings.DueDateLabel + ENUSStrings.BlankErrorMessage;
        }
    }
    else {
        if (!fields.checkNumber) {
            errors.checkNumberError = ENUSStrings.CheckNumberLabel + ENUSStrings.BlankErrorMessage;
        }
        if (!fields.paymentDate) {
            errors.paymentDateError = ENUSStrings.PaymentDateLabel + ENUSStrings.BlankErrorMessage;
        }
    }

    if (!fields.total) {
        errors.totalError = ENUSStrings.TotalLabel + ENUSStrings.BlankErrorMessage;
    }
    else if (!isValueNumber(fields.total)) {
        errors.totalError = ENUSStrings.TotalLabel + ENUSStrings.NumberErrorMessage;
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}