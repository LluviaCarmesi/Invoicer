import SETTINGS from "../AppSettings";
import ENUSStrings from "../strings/ENUSStrings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCompanyCustomers(companyID) {
    let customers = [];
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.COMPANIES_API_URI}/${companyID}${SETTINGS.CUSTOMERS_URI}`)
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
        doesErrorExist = true;
        errorMessage = ENUSStrings.NoCompanyCustomersErrorMessage;
    }
    return { customers, doesErrorExist, errorMessage };
}