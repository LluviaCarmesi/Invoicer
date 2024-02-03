import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCustomer(customerID) {
    let customer = {};
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.CUSTOMERS_API_URI}/${customerID}`)
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
            else {
                customer = result;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    return { customer, doesErrorExist, errorMessage };
}