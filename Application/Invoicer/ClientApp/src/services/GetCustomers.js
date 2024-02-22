import SETTINGS from "../AppSettings";
import ENUSStrings from "../strings/ENUSStrings";
import getCookie from "../utilities/GetCookie";
import setCookie from "../utilities/SetCookie";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCustomers() {
    let customers = [];
    let doesErrorExist = false;
    let errorMessage = "";
    const allCustomersCookie = getCookie(SETTINGS.COOKIE_KEYS.ALL_CUSTOMERS);
    if (!!allCustomersCookie) {
        customers = JSON.parse(allCustomersCookie);
    }
    else {
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
                    setCookie(SETTINGS.COOKIE_KEYS.ALL_CUSTOMERS, JSON.stringify(customers), 2);
                }
            })
            .catch((error) => {
                doesErrorExist = true;
                errorMessage = error;
                console.log(error);
            });
    }
    if (customers.length === 0 && !errorMessage) {
        doesErrorExist = true;
        errorMessage = ENUSStrings.NoCustomersErrorMessage;
    }
    return { customers, doesErrorExist, errorMessage };
}