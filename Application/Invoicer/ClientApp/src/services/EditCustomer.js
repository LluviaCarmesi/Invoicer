import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function editCustomer(item, customerID) {
    let doesErrorExist = false;
    let errorMessage = "";
    let result = "";
    await fetch(`${SETTINGS.CUSTOMERS_API_URI}${SETTINGS.EDIT_CUSTOMER_URI}/${customerID}`, {
        method: "PUT",
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
            result = result.response;
            if (doesErrorExist) {
                errorMessage = result.response;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    return { doesErrorExist, errorMessage };
}