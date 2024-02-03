import SETTINGS from "../AppSettings";
import ENUSStrings from "../strings/ENUSStrings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCustomers() {
    let customers = [];
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.CUSTOMERS_API_URI}`)
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
            else {
                customers = result;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    if (customers.length === 0 && !errorMessage) {
        errorMessage = ENUSStrings.NoCustomersErrorMessage;
    }
    return { customers, doesErrorExist, errorMessage };
}