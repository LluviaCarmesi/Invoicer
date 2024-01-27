import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCompanyTransactions(companyID) {
    let transactions = [];
    let doesErrorExist = false;
    let errorMessage = "";
    if (companyID !== 0) {
        await fetch(`${SETTINGS.COMPANIES_API_URI}/${companyID}${SETTINGS.TRANSACTIONS_URI}`)
            .then((response) => {
                doesErrorExist = !isStatusGood(response.status);
                return response.json();
            })
            .then((result) => {
                if (doesErrorExist) {
                    errorMessage = result.response;
                }
                else {
                    transactions = result;
                }
            })
            .catch((error) => {
                doesErrorExist = true;
                errorMessage = error;
                console.log(error);
            });
    }
    if (transactions.length === 0 && !errorMessage) {
        errorMessage = "No transactions exist for this company";
    }
    return { transactions, doesErrorExist, errorMessage };
}