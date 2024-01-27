import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getTransaction(transactionID) {
    let transaction = {};
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.TRANSACTIONS_API_URI}/${transactionID}`)
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
            else {
                transaction = result;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    return { transaction, doesErrorExist, errorMessage };
}