import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function addTransaction(item, companyID) {
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.GET_COMPANIES_URI}/${companyID}${SETTINGS.ADD_TRANSACTION_URI}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    return {doesErrorExist, errorMessage};
}