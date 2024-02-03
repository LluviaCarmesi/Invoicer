import SETTINGS from "../AppSettings";
import ENUSStrings from "../strings/ENUSStrings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCustomerTransactions(customerID) {
    let transactions = [];
    let remainingBalance = 0;
    let doesErrorExist = false;
    let errorMessage = "";
    if (customerID !== 0) {
        await fetch(`${SETTINGS.CUSTOMERS_API_URI}/${customerID}${SETTINGS.TRANSACTIONS_URI}`)
            .then((response) => {
                doesErrorExist = !isStatusGood(response.status);
                return response.json();
            })
            .then((result) => {
                if (doesErrorExist) {
                    errorMessage = result.response;
                }
                else {
                    transactions = result.transactions;
                    remainingBalance = result.remainingBalance;
                }
            })
            .catch((error) => {
                doesErrorExist = true;
                errorMessage = error;
                console.log(error);
            });
    }
    if (transactions.length === 0 && !errorMessage) {
        errorMessage = ENUSStrings.NoTransactionsErrorMessage;
    }
    return { transactions, remainingBalance, doesErrorExist, errorMessage };
}