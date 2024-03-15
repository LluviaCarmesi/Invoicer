import ENUSStrings from "../../strings/ENUSStrings"
import isValueNumber from "./IsValueNumber";
import doErrorsExist from "./DoErrorsExist";
import SETTINGS from "../../AppSettings";

export default function transactionFormValidation(values) {
    let isValid = true;
    let errors = {
        dueDateError: "",
        paymentDateError: "",
        totalError: "",
    };
    if (values.type === SETTINGS.TRANSACTION_TYPE_CHOICES.INVOICE) {
        if (!values.dueDate) {
            errors.dueDateError = ENUSStrings.DueDateLabel + ENUSStrings.BlankErrorMessage;
        }
    }
    else {
        if (!values.paymentDate) {
            errors.paymentDateError = ENUSStrings.PaymentDateLabel + ENUSStrings.BlankErrorMessage;
        }
        if (!values.total) {
            errors.totalError = ENUSStrings.TotalLabel + ENUSStrings.BlankErrorMessage;
        }
        else if (parseInt(values.total) <= 0) {
            errors.totalError = ENUSStrings.TotalLabel + ENUSStrings.PositiveNumberErrorMessage;
        }
    }

    isValid = !doErrorsExist(errors);

    return { isValid, errors };
}